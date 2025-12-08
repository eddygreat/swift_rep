# Premier Support AI: Multi-Agent Customer Service System

![Premier Support AI](https://via.placeholder.com/800x400?text=Premier+Support+AI+Dashboard)

## 🚀 Overview
**Premier Support AI** is a state-of-the-art customer support platform powered by **Multi-Agent Systems**. It goes beyond simple chatbots by orchestrating a team of specialized AI agents to handle complex queries, routing them intelligently, and seamlessly escalating to humans when necessary.

The system features a **Supervisor AI** (The Brain) that analyzes user intent and routes tasks to:
*   **Billing Agent**: Handles invoice status, payments, and refunds.
*   **Tech Support Agent**: Troubleshoots device issues using technical manuals.
*   **Human Escalation**: smooth handoff to real support staff for sensitive issues.

Wrapped in a **Premium, Glassmorphic React Interface**, it offers a modern and trustworthy user experience.

---

## ✨ Key Features
*   **🧠 Intelligent Routing**: A Supervisor Node (LangGraph) dynamically decides which agent should handle a query.
*   **⚡ Specialized Tools**: Agents have access to real-time tools (Mock Invoice DB, Tech Manual RAG).
*   **🛡️ Human-in-the-Loop**: Automatic escalation detection with a dedicated UI for handoff.
*   **💎 Premium UI**: Built with React, Tailwind CSS, and Framer Motion for a fluid, app-like experience.
*   **💬 Natural Language**: Agents interpret raw data and respond in friendly, human-like sentences.

---

## 🛠️ Tech Stack
### Backend (The Brain)
*   **Python 3.10+**
*   **LangGraph & LangChain**: For agent orchestration and state management.
*   **FastAPI**: High-performance API server.
*   **Google Gemini (Flash)**: Cost-effective, high-speed LLM.

### Frontend (The Face)
*   **React 19 + Vite**: Blazing fast frontend tooling.
*   **Tailwind CSS v4**: Utility-first styling with modern defaults.
*   **Framer Motion**: Smooth, physics-based animations.
*   **Lucide React**: Beautiful, consistent iconography.

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10 or higher
*   Node.js v18+ and npm
*   A Google Cloud API Key (for Gemini)

### 1. Backend Setup
Clone the repository and navigate to the root:
```bash
git clone https://github.com/your-username/multi-agent-plus.git
cd multi-agent-plus
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Set up your environment variables:
1.  Copy `.env.example` to `.env`.
2.  Add your `GOOGLE_API_KEY`.

Start the Backend Server:
```bash
uvicorn app.server:app --reload
```
*The API will be available at `http://localhost:8000`.*

### 2. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
*The App will be available at `http://localhost:5173`.*

---

## 📖 Usage Guide

### 1. Billing Queries
Ask about invoices to trigger the **Billing Agent**:
> "What is the status of invoice INV-123?"
> "How much do I owe on invoice INV-456?"

### 2. Technical Support
Ask about devices to trigger the **Tech Support Agent**:
> "How do I reset my router?"
> "The modem light is blinking red."

### 3. Human Escalation
Ask to speak to a person to test the **Escalation Flow**:
> "I want to speak to a human."
> "This is too complicated, get me a manager."

---

## 📂 Project Structure
```
multi-agent-plus/
├── app/                    # Backend Source Code
│   ├── graphs.py           # LangGraph State Machine Definition
│   ├── nodes.py            # Agent Logic (Supervisor, Workers)
│   ├── server.py           # FastAPI Entry Point
│   ├── state.py            # Shared State Schema
│   └── tools.py            # Mock Tools (Database/Manuals)
├── frontend/               # React Application
│   ├── src/components/     # UI Components (ChatInterface)
│   └── src/api.js          # Backend Connector
└── requirements.txt        # Python Dependencies
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License
MIT License.
