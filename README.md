# 🌌 Poppy AI: Next-Gen Career Counselor for Indian Students

Poppy is an empathetic, AI-powered career counseling and roadmap synthesis platform. It is designed specifically to guide Indian high-school and college students through a highly personalized diagnostic process, helping them discover optimal academic trajectories, hybrid career combinations, and realistic localized blueprints (colleges, target domestic/MNC employers, starting packages, and competitive exam tracks).

---

## 🌟 Key Features

*   **👁️ Multimodal Visual Vibe Check (Step 1):** Users upload a picture of their study setup, workspace, or textbook stacks. A local **VLM (Vision-Language Model)** analyzes study clues, desk gadgets, and hobbies to confirm or challenge their interest alignment with rich reasoning logs.
*   **📊 Responsive Cockpit Profile Stack (Step 2):** A wide-screen dashboard layout mapping 10th/12th academic grades, stream selections, dynamic scrollable multi-subject tag chips, target cities, work style preferences, core values, and biggest anxieties.
*   **💬 State-Governed Discovery Dialogue (Step 3):** An active **10-question career diagnostic interview** driven by an empathetic AI state machine. Questions dynamically personalize based on Step 2 inputs, combined with structured Server-Sent Events (SSE) word-by-word token streaming and dynamic dynamic reply chip suggestions.
*   **🗺️ Interactive Glassmorphism Career Dashboard (Step 4):** Synthesizes full personality logs into 3 personalized optimal career paths. Each path includes:
    *   **Fit Score Metric (0-100)** mapping suitability.
    *   **"Why This Path" Analysis** addressing user anxieties.
    *   **3-Stage Roadmap (Now, Graduation, 5-Year Vision)** with actionable steps.
    *   **Localized Indian Context Blueprint:** Specifying target local exams (e.g. GATE, CAT, UPSC, NEET), specific Indian and MNC companies (e.g. Razorpay, CRED, Jio AI Labs, Google India), and realistic average salary expectations (LPA).
*   **🚀 Performance FPS Isolation:** Starry particle animation engine automatically shuts down at Step 4 to ensure a locked **60FPS rendering performance** during complex report reveals and Framer Motion visual transitions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React, TypeScript, TailwindCSS, Framer Motion, Lucide Icons, SSE Client hooks |
| **Backend** | FastAPI (Async Concurrency), Python 3.10+, Pydantic, HTTPX, File-based local session store |
| **AI / Inference** | Local **Ollama Engine** (LLM & VLM Vision models), Structured dynamic dynamic JSON prompts |

---

## 🚀 Setup & Installation Guide

Follow these steps to set up and run Poppy Career Counselor locally on your machine.

### 📋 Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [Python](https://www.python.org/) (v3.10 or higher)
*   [Ollama](https://ollama.com/) (For local LLM & Vision model inference)

---

### 🧠 Step 1: Set Up Local AI Models (Ollama)

Poppy runs entirely on local, private inference models. 

1. **Install and Launch Ollama** from the official [website](https://ollama.com/).
2. **Download the Default AI Model:**
   ```bash
   ollama pull gemma4:e2b
   ```

---

### 🐍 Step 2: Set Up Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configuration Check:** Open `config.py` and verify your Ollama connection hosts and model names:
   ```python
   # backend/config.py
   ollama_host: str = "http://localhost:11434"
   model_name: str = "gemma4:e2b"       # Core LLM for Chat & Report Generation
   vision_model: str = "gemma4:e2b"      # Multimodal Model for Image Vibe Check
   ```
5. Start the backend development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The FastAPI server will start running on **`http://localhost:8000`**.*

---

### 💻 Step 3: Set Up Frontend (Next.js)

1. Open a new terminal tab/window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Launch the Next.js local development server:
   ```bash
   npm run dev
   ```
   *The Next.js client will start running on **`http://localhost:3000`**.*

---

## 📂 Project Directory Structure

```
careercons/
├── README.md               # Visual presentation guide (this file)
├── .gitignore              # Multi-framework cache ignores (node_modules, caches, local session json)
├── start.sh                # Shell script to kick off servers
├── backend/
│   ├── main.py             # FastAPI App initiator and CORS configurations
│   ├── config.py           # Model bindings, temperatures, and host ports
│   ├── sessions_db.json    # File-serialized persistent session database
│   ├── prompts/            # Markdown prompt templates for structured JSON outputs
│   │   ├── chat_json.md    # Formats empathetic acknowledgments and dynamic quick-options
│   │   ├── report_generation.md# Comprehensive multi-path synthetic career report schema
│   │   └── system.md       # Poppy core role guidelines
│   ├── routers/
│   │   ├── chat.py         # SSE dialogue client, dynamic option parsing, and token streaming
│   │   ├── image_analysis.py# Multimodal visual analysis normalization
│   │   └── report.py       # Generation synthetic routes, saves, and history retrieval
│   └── services/
│       ├── orchestrator.py # Empathy state machine governs 10 questions (Foundation/Deep Dive)
│       └── ollama_client.py# Async HTTP client and streaming pipelines with Ollama
└── frontend/
    ├── app/                # Next.js App routing
    │   ├── globals.css     # Global fluid theme styles
    │   └── page.tsx        # Entry dashboard coordinating 4 Step components
    ├── components/
    │   ├── steps/
    │   │   ├── Step1_VibeCheck.tsx       # Photo upload / VLM visual observation feedback interface
    │   │   ├── Step2_AcademicProfile.tsx # Responsive horizontal cockpit cards & values stack
    │   │   ├── Step3_ChatInterface.tsx   # SSE chatbot typewriting dynamic conversation
    │   │   └── Step4_ReportReveal.tsx    # Horizontal glassmorphism optimal career roadmap
    │   └── ui/
    │       ├── slider.tsx                # Decoupled absolute layout slider component
    │       └── select.tsx / button.tsx   # Premium customized design variables
    └── lib/
        ├── api.ts          # Consolidated client side HTTP/SSE connectors
        └── animations.ts   # Unified Framer Motion animation configurations
```

---

## 🔍 System Verification Checklist

To confirm everything is operating correctly, complete this sanity check:
1. **Model Check:** Run `ollama list` and verify `gemma4:e2b` is loaded.
2. **Backend Handshake:** Open `http://localhost:8000/docs` in your browser to verify the Swagger UI loads the active routers (`/session`, `/profile`, `/chat`, `/report`).
3. **Desk Upload Verification:** Upload a photo in Step 1. Verify the console records `[Ollama VLM Start]` and receives a parsed JSON payload with clues reasoning and field classifications.
4. **Chat Validation:** Answer a question in Step 3. Verify that the answer typewrites word-by-word in real time and renders 3 customized suggestion chips.
