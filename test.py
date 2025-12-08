import requests
import json

try:
    response = requests.post(
        "http://localhost:8000/chat", 
        json={"message": "Please look up invoice INV-123", "thread_id": "test-session-new-1"}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
