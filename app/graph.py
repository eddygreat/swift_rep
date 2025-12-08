from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from app.state import AgentState
from app.nodes import supervisor_node, billing_agent_node, tech_support_agent_node, escalate_node

def create_graph():
    """
    Defines the multi-agent workflow graph.
    """
    # Initialize the graph with our custom state
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("Supervisor", supervisor_node)
    workflow.add_node("BillingAgent", billing_agent_node)
    workflow.add_node("TechSupportAgent", tech_support_agent_node)
    workflow.add_node("EscalateToHuman", escalate_node)
    
    # Set entry point
    workflow.set_entry_point("Supervisor")
    
    # Define conditional edges from Supervisor
    # The 'next' key in state determines which node to visit next
    workflow.add_conditional_edges(
        "Supervisor",
        lambda state: state["next"],
    )
    
    # Edges from workers back to Supervisor
    # The workers report back their results, and we loop back to Supervisor to decide next steps
    workflow.add_edge("BillingAgent", "Supervisor")
    workflow.add_edge("TechSupportAgent", "Supervisor")
    
    # Escalation ends the automated flow
    workflow.add_edge("EscalateToHuman", END)
    
    # Compile the graph with a built-in memory saver for persistence
    # This allows us to pass 'thread_id' to maintain state
    memory = MemorySaver()
    graph = workflow.compile(checkpointer=memory)
    
    return graph
