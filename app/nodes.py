import os
from typing import Literal
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel, Field

from app.state import AgentState
from app.tools import lookup_invoice, query_manual

load_dotenv()

# Initialize the LLM
# We use Gemini 1.5 Flash for speed and cost effectiveness
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", temperature=0, max_retries=3)

# --- 1. Supervisor Node ---

class Route(BaseModel):
    next: Literal["BillingAgent", "TechSupportAgent", "EscalateToHuman", "__end__"] = Field(
        ..., description="The next agent to route the request to, or __end__ if finished."
    )

supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a supervisor tasked with managing a conversation between the following workers: BillingAgent, TechSupportAgent. Given the following user request, respond with the worker to act next. Each worker will perform a task and respond with their results and status. If the user's question has been answered fully or if the conversation is done, respond with __end__. If the confidence is low or the user requests a human, respond with EscalateToHuman."),
    MessagesPlaceholder(variable_name="messages"),
    ("system", "Given the conversation above, who should act next?")
])

def supervisor_node(state: AgentState):
    """
    The Supervisor determines the next step based on the conversation history.
    It outputs a structured 'Route' object which determines the conditional edge.
    """
    supervisor_chain = supervisor_prompt | llm.with_structured_output(Route)
    result = supervisor_chain.invoke(state)
    return {"next": result.next}

# --- 2. Worker Nodes ---

def _run_agent(state: AgentState, agent_runnable, name: str):
    """
    Helper function to run a worker agent. 
    It invokes the LLM with tools, and if a tool is called, it executes it immediately.
    We append both the AI message and the Tool output (if any) to the history.
    If tools were called, we invoke the LLM again to generate a final natural language response.
    """
    messages = state["messages"]
    response = agent_runnable.invoke(messages)
    
    results = [response]
    
    # If the LLM decided to call tools, we execute them
    if response.tool_calls:
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]
            
            # Execute the appropriate tool
            if tool_name == "lookup_invoice":
                tool_output = lookup_invoice.invoke(tool_args)
            elif tool_name == "query_manual":
                tool_output = query_manual.invoke(tool_args)
            else:
                tool_output = f"Error: Tool {tool_name} not found."
            
            # Create a ToolMessage to represent the result
            tool_msg = ToolMessage(
                content=str(tool_output), 
                tool_call_id=tool_call["id"], 
                name=tool_name
            )
            results.append(tool_msg)
            
        # --- NEW STEP: Call the LLM again to interpret the tool output ---
        # We construct a temporary list of messages including the original history + new response + tool output
        # This is strictly within the scope of this node execution for generating the final answer.
        sub_chain_messages = messages + results
        final_response = agent_runnable.invoke(sub_chain_messages)
        results.append(final_response)
            
    return {"messages": results}

def billing_agent_node(state: AgentState):
    """
    Billing agent handles invoice lookups.
    """
    # Bind the specific tool for this agent
    billing_llm = llm.bind_tools([lookup_invoice])
    return _run_agent(state, billing_llm, "BillingAgent")

def tech_support_agent_node(state: AgentState):
    """
    Tech support agent handles device manual queries.
    """
    tech_llm = llm.bind_tools([query_manual])
    return _run_agent(state, tech_llm, "TechSupportAgent")

# --- 3. Escalate Node ---

def escalate_node(state: AgentState):
    """
    Marks the conversation for human review.
    """
    return {"messages": [SystemMessage(content="[SYSTEM] The conversation has been escalated to a human agent.")]}
