from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from app.graph import create_graph

app = FastAPI(title="Multi-Agent Customer Support")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the graph once
graph = create_graph()

class ChatRequest(BaseModel):
    message: str
    thread_id: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Process a user message through the multi-agent system.
    Maintains conversation history via thread_id.
    """
    config = {"configurable": {"thread_id": request.thread_id}}
    
    # Create the input message
    input_message = HumanMessage(content=request.message)
    
    try:
        # Invoke the graph
        # 'invoke' runs the workflow until it reaches the END node.
        # Since we use a checkpointer (MemorySaver), the state is persisted associated with the thread_id.
        # We pass "messages" as a list, which LangGraph's 'operator.add' reducer will append to the existing history.
        final_state = graph.invoke({"messages": [input_message]}, config)
        
        # Extract the last message from the conversation history
        messages = final_state.get("messages", [])
        if not messages:
            return {"response": "No response generated."}
            
        # Return the content of the last message (usually the final answer from Supervisor or an Agent)
        last_message = messages[-1]
        return {"response": last_message.content}
    
    except Exception as e:
        # In a real production app, we would log the error and return a more specific message
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use standard port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
