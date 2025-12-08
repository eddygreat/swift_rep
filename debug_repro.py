import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from app.graph import create_graph

load_dotenv()

def debug_run():
    graph = create_graph()
    thread_id = "debug-session-1"
    config = {"configurable": {"thread_id": thread_id}}
    
    # Test Case 1: Billing
    print("\n--- TEST: Billing Invoice INV-123 ---")
    input_message = HumanMessage(content="Check status of invoice INV-123")
    
    # Run step-by-step or full invoke
    # We use invoke to match server.py behavior
    final_state = graph.invoke({"messages": [input_message]}, config)
    
    print("\n--- FINAL STATE MESSAGES ---")
    for msg in final_state["messages"]:
        print(f"[{msg.type}] {msg.name if hasattr(msg, 'name') else ''}: {msg.content}")

    # Test Case 2: Tech Support
    print("\n--- TEST: Tech Support Router ---")
    input_message = HumanMessage(content="How do I reset my router?")
    final_state = graph.invoke({"messages": [input_message]}, config)
    
    print("\n--- FINAL STATE MESSAGES ---")
    for msg in final_state["messages"]:
        print(f"[{msg.type}] {msg.name if hasattr(msg, 'name') else ''}: {msg.content}")

if __name__ == "__main__":
    debug_run()
