# Poppy — Career Counseling App: Implementation Plan

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js)              │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  ┌─────┐  │
│  │ Step 1:  │→│ Step 2:  │→│Step3:│→│Step4│  │
│  │Vibe Check│  │Academic  │  │Chat  │  │Report│  │
│  │ (3D UI)  │  │ Profile  │  │ UI   │  │Reveal│  │
│  └──────────┘  └──────────┘  └──────┘  └─────┘  │
│         │            │           │         │      │
│         └────────────┴───────────┴─────────┘      │
│                         │ HTTP/SSE                │
└─────────────────────────┼─────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────┐
│              Backend (FastAPI / Node.js)           │
│  ┌───────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Session   │  │ Prompt       │  │ Ollama      │  │
│  │ Manager   │→│ Engineering  │→│ Client      │  │
│  │(in-memory)│  │ & Chaining   │  │ (HTTP API)  │  │
│  └───────────┘  └──────────────┘  └──────┬─────┘  │
│                                          │        │
│                               ┌──────────▼──────┐ │
│                               │  Ollama (local)  │ │
│                               │  Gemma 2B (Q4)   │ │
│                               └─────────────────┘ │
└───────────────────────────────────────────────────┘
```

---

## I. BACKEND IMPLEMENTATION

### 1. Tech Stack

| Layer        | Choice                          | Rationale                                      |
|-------------|---------------------------------|------------------------------------------------|
| Runtime      | Python 3.11+                    | Best Ollama/vLLM ecosystem                     |
| Framework    | FastAPI                         | Async, SSE streaming, auto-docs, fast          |
| AI Client    | `ollama` Python library + HTTP  | Direct Ollama API, streaming support           |
| Session      | In-memory dict + UUID           | Simple; no DB needed for MVP                   |
| Validation   | Pydantic v2                     | Native FastAPI integration                     |

### 2. API Endpoints

```
POST   /api/session/create              → { session_id }
POST   /api/vibe/select                 → { session_id, selected_field }
POST   /api/profile/submit              → { session_id, profile_data }
POST   /api/chat/message                → SSE stream of tokens
POST   /api/report/generate             → { report }
GET    /api/session/{id}/state          → { current_step, data }
```

**POST /api/session/create**

Creates a new session, initializes the prompt chain, returns a UUID.

**POST /api/vibe/select**

Stores the user's selected career field (Tech & AI, Commerce, Medicine, etc.).

**POST /api/profile/submit**

Receives academic profile data:
```json
{
  "session_id": "uuid",
  "class_10_percentage": 92,
  "class_12_stream": "Science",
  "class_12_percentage": 88,
  "entrance_exam": "JEE",
  "entrance_score": 220,
  "current_education": "B.Tech 2nd year CSE",
  "location": "Mumbai",
  "languages": ["English", "Hindi"],
  "extracurricular": ["coding club", "debate"]
}
```

**POST /api/chat/message (SSE Stream)**

```json
{
  "session_id": "uuid",
  "message": "I enjoy building things but also like working with people"
}
```

Response: `text/event-stream` with tokens emitted as SSE events.
```
data: {"token": "Based"}
data: {"token": " on"}
data: {"token": " your"}
data: {"token": " profile..."}
data: {"done": true}
```

**POST /api/report/generate**

Aggregates all session data → constructs a final prompt → streams full analysis → returns structured report:

```json
{
  "session_id": "uuid",
  "report": {
    "top_3_paths": [
      {
        "rank": 1,
        "title": "AI/ML Engineer → Research Scientist",
        "fit_score": 94,
        "why": "Your coding background + JEE math strength...",
        "roadmap": [
          { "phase": "Now (College)", "steps": ["Master DSA", "Learn PyTorch", "Build 2 projects"] },
          { "phase": "Graduation", "steps": ["GATE CS prep", "Intern at FAANG/startup"] },
          { "phase": "5-Year", "steps": ["MS/MTech or direct industry", "Publish a paper"] }
        ],
        "indian_context": {
          "exams": ["GATE CS"],
          "target_companies": ["Google Research", "Microsoft Research", "Adobe", "Crucible of AI Labs"],
          "avg_salary_range": "₹12-25 LPA fresher, ₹40+ LPA after 5yr"
        }
      }
    ],
    "summary": "Your profile strongly aligns with research-oriented CS roles...",
    "disclaimer": "..."
  }
}
```

### 3. Prompt Engineering Architecture

**System Prompt (base):**
```
You are Poppy, an empathetic Indian career counselor AI.
You understand the Indian education system (10th, 12th streams, 
JEE/NEET/CUET/GATE, B.Tech/B.Sc/B.Com, PSU jobs, etc.).

Your tone: encouraging, practical, specific.
You NEVER give generic advice. Every suggestion must reference 
a concrete exam, college, company, or role relevant in India.

For each recommendation, provide:
- Why it fits (tie to their specific inputs)
- A phased roadmap with Indian milestones (exams, certificates, 
city considerations)
- Salary range expectations in INR
- Target companies or further study paths
```

**Step-by-step prompt chaining:**

1. **Initialization prompt** (on session create):
   - Start with the base system prompt
   - Signal readiness to receive field preference

2. **Vibe-select prompt** (after field chosen):
   - Acknowledge the field
   - Ask questions to narrow sub-specialization
   - Instruct the model to prepare for academic profile intake

3. **Profile prompt** (after profile submitted):
   - Embed all profile data into context
   - Generate initial assessment + prepare to chat deeper

4. **Chat prompt** (per user message):
   - Full conversation history as context
   - Instruct short, conversational responses
   - Encourage exploration of interests, dislikes, lifestyle preferences

5. **Report generation prompt** (final):
   - Full aggregated context (field + profile + chat history)
   - Instruct structured JSON output with top 3 paths
   - Each path must have: title, fit score (0-100), rationale, phased roadmap, Indian context, salary range

### 4. Session State Schema

```python
@dataclass
class SessionState:
    session_id: str
    current_step: int  # 1-4
    selected_field: str | None
    profile_data: dict | None
    chat_history: list[dict]  # [{role, content}]
    created_at: datetime
    last_active: datetime
```

### 5. Project Structure (Backend)

```
backend/
├── main.py                 # FastAPI app, CORS, lifespan
├── config.py               # Settings (OLLAMA_HOST, MODEL_NAME, etc.)
├── requirements.txt
├── routers/
│   ├── session.py          # /api/session/*
│   ├── vibe.py             # /api/vibe/*
│   ├── profile.py          # /api/profile/*
│   ├── chat.py             # /api/chat/*
│   └── report.py           # /api/report/*
├── services/
│   ├── ollama_client.py    # Async HTTP client to Ollama
│   ├── prompt_manager.py   # Prompt templates & chain logic
│   └── session_store.py    # In-memory session management
├── schemas/
│   ├── session.py          # Pydantic models
│   ├── profile.py
│   ├── chat.py
│   └── report.py
└── prompts/
    ├── system.md
    ├── vibe.md
    ├── profile_analysis.md
    ├── chat.md
    └── report_generation.md
```

### 6. Key Backend Implementation Details

**Ollama Client (services/ollama_client.py):**
```python
import httpx
import json

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434", model="gemma2:2b"):
        self.base_url = base_url
        self.model = model
        self.client = httpx.AsyncClient(timeout=120)

    async def generate_stream(self, messages: list, system: str = ""):
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "stream": True,
            "options": {"temperature": 0.7, "num_predict": 2048}
        }
        async with self.client.stream("POST", f"{self.base_url}/api/chat", json=payload) as resp:
            async for line in resp.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "message" in data:
                        yield data["message"]["content"]
                    if data.get("done"):
                        break
```

**Prompt Manager (services/prompt_manager.py):**
- Loads markdown prompt files
- Injects dynamic values (profile data, chat history)
- Manages context window (truncates oldest messages when exceeding token budget)

**SSE Streaming in FastAPI (routers/chat.py):**
```python
from fastapi.responses import StreamingResponse

@router.post("/message")
async def chat_message(body: ChatRequest):
    session = get_session(body.session_id)

    async def event_stream():
        async for token in ollama.generate_stream(
            messages=session.chat_history + [{"role": "user", "content": body.message}],
            system=load_prompt("chat")
        ):
            yield f"data: {json.dumps({'token': token})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
```

---

## II. FRONTEND IMPLEMENTATION

### 1. Tech Stack

| Layer         | Choice                       | Rationale                                    |
|--------------|------------------------------|----------------------------------------------|
| Framework     | Next.js 14 (App Router)      | React + SSR + file-based routing             |
| Language      | TypeScript                   | Type safety for complex state                |
| Styling       | Tailwind CSS                 | Utility-first, rapid prototyping             |
| UI Library    | Shadcn/ui                    | Accessible, customizable components          |
| Animation     | Framer Motion                | AnimatePresence, spring physics, layout      |
| Icons         | Lucide React                 | Consistent icon set                          |
| State         | React Context + useReducer   | Multi-step form state across screens         |
| HTTP          | Fetch API + EventSource      | SSE consumption for chat streaming           |

### 2. Component Tree

```
App
├── Providers (Theme, SessionContext)
└── HomePage
    ├── AnimatedProgressBar
    └── AnimatePresence
        ├── Step1_VibeCheck
        │   ├── Carousel3D
        │   │   └── FieldCard (×N)
        │   ├── ArrowLeft / ArrowRight
        │   └── NextButton
        ├── Step2_AcademicProfile
        │   ├── ScoreSlider (class 10 %)
        │   ├── StreamSelector
        │   ├── ScoreSlider (class 12 %)
        │   ├── ExamDropdown
        │   ├── ScoreInput
        │   ├── EducationLevelSelector
        │   ├── LocationInput
        │   ├── LanguageMultiSelect
        │   └── NextButton
        ├── Step3_ChatInterface
        │   ├── MessageList
        │   │   └── MessageBubble (×N)
        │   ├── TypingIndicator
        │   └── ChatInput
        └── Step4_ReportReveal
            ├── AnalyzeOverlay (fullscreen animation)
            └── ReportCards
                └── PathCard (×3)
                    ├── FitScoreBadge
                    ├── RoadmapTimeline
                    └── IndianContextBox
```

### 3. Step-by-Step UI/UX Detail

#### Step 1: Vibe Check (3D Carousel)

**Layout:** Full screen. Cards rotate in 3D space with perspective.

**Animation:**
- Cards arranged in a horizontal arc using `rotateY` and `translateZ`
- Active card faces camera (rotateY: 0), scale: 1.1
- Adjacent cards are slightly rotated (rotateY: ±15°), scale: 0.9
- Outer cards: rotateY: ±30°, scale: 0.7, opacity: 0.5
- Smooth spring transitions on change (`spring: { stiffness: 200, damping: 20 }`)

**Content per card:**
```
┌──────────────────────────┐
│     ⚡ Tech & AI         │  ← Bold, large, glowing text
│                          │
│  Build the future with   │
│  code & intelligence     │
│                          │
│   [98% fit rate]         │  ← Subtle stat
└──────────────────────────┘
```

**Fields (6 cards):**
| Card          | Icon | Color      |
|---------------|------|------------|
| Tech & AI     | ⚡   | #6366f1    |
| Medicine      | ❤️   | #ef4444    |
| Commerce      | 📈   | #22c55e    |
| Creative Arts | 🎨   | #f59e0b    |
| Law & Policy  | ⚖️   | #8b5cf6    |
| Sciences      | 🔬   | #06b6d4    |

**Controls:** Arrow buttons (left/right) + click on card to select.

#### Step 2: Indian Academic Profile

**Layout:** Centered form card, max-w-lg, scrollable if needed.

**Components (customized Shadcn):**

- **Class 10 Percentage:** Animated slider with gradient track. Value displayed as large floating number above thumb.
- **Stream (12th):** Segmented button group: Science | Commerce | Arts.
- **Class 12 Percentage:** Same slider style.
- **Entrance Exam:** Combobox/dropdown with search: JEE Main, JEE Advanced, NEET, CUET, NATA, CLAT, none.
- **Entrance Score:** Numeric input with validation range.
- **Current Education:** Radio group: 10th pass, 12th pass, pursuing UG, UG completed, pursuing PG.
- **College/University:** Text input with autocomplete suggestions (optional).
- **Location:** Text input for city/state.
- **Languages Known:** Multi-select chips.

**Animations:**
- Each field fades in sequentially with stagger (delay: 0.1s each)
- Slider thumb scales up on drag
- Validation errors shake gently (Framer Motion `x: [0, -5, 5, -5, 5, 0]`)

#### Step 3: Deep Dive Chat

**Layout:** Full height chat interface. Messages aligned left (AI) / right (user).

**Styling:**
- AI bubbles: rounded-2xl rounded-tl-sm, bg-white border, shadow
- User bubbles: rounded-2xl rounded-tr-sm, bg-indigo-500 text-white
- Input bar fixed at bottom with send button

**Animations:**
- AI messages: `initial={{ opacity: 0, y: 20, scale: 0.95 }}` → `animate={{ opacity: 1, y: 0, scale: 1 }}`  
  `transition={{ type: "spring", stiffness: 200, damping: 20 }}`
- User messages: same but from opposite direction
- Typing indicator: 3 pulsing dots staggered (`scale: [0, 1, 0]` looping, delay per dot)
- Auto-scroll to bottom with smooth scrollIntoView

**SSE Consumption:**
```typescript
const [streamingText, setStreamingText] = useState("");
const eventSource = useRef<EventSource | null>(null);

const sendMessage = async (text: string) => {
  // Add user message immediately
  addMessage({ role: "user", content: text });

  // Start SSE stream
  const res = await fetch("/api/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id, message: text }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        if (data.done) {
          addMessage({ role: "assistant", content: streamingText });
          setStreamingText("");
        } else {
          setStreamingText(prev => prev + data.token);
        }
      }
    }
  }
};
```

#### Step 4: Immersive Reveal + Report

**Sub-step 4a: Analysis Animation (3 seconds)**

Full-screen overlay:
```
┌──────────────────────────────────────┐
│                                      │
│     ╔══════════════════════════╗     │
│     ║  Analyzing your profile  ║     │
│     ║  ━━━━━━━━━━━━▓━━━━━━ 73%║     │
│     ║  "Matching vectors..."   ║     │
│     ╚══════════════════════════╝     │
│                                      │
│   ┌──────┐ ┌──────┐ ┌──────┐        │
│   │ ╱╲    │ │ ╱╲    │ │ ╱╲    │        │
│   │╱  ╲   │ │╱  ╲   │ │╱  ╲   │        │
│   │     ╲ │ │     ╲ │ │     ╲ │        │
│   │      ╲│ │      ╲│ │      ╲│        │
│   └──────┘ └──────┘ └──────┘        │
│   Tech    Med     Comm              │
│                                      │
└──────────────────────────────────────┘
```

Implementation:
- Full-screen fixed overlay with dark backdrop
- Gradient orb animation (conic gradient rotating)
- Progress bar fills from 0→100% over 3s
- Fake "analyzing" status messages cycle every 500ms
- Particles or shimmer effect optional

**Sub-step 4b: Report Cards (Aceternity-style)**

Three cards in a row (or column on mobile):
```
┌──────────────────────────────────────────────┐
│  🥇 #1  AI/ML Engineer → Research Scientist  │
│  ┌──────┐  Fit Score: 94%                     │
│  │      │  ━━━━━━━━━━━━━━━━━━━━━              │
│  │      │                                     │
│  └──────┘  Why: Your coding background + JEE  │
│             math aptitude + interest in       │
│             building things → perfect for AI  │
│                                              │
│  📍 Roadmap:                                  │
│  ┌──────────────────────────────────────────┐│
│  │ ●●○  Now (College)  │ ●●○  Grad  │ ●○○ 5yr│
│  │ Master DSA          │ GATE CS    │ MS/PhD │
│  │ Learn PyTorch       │ FAANG intern│Publish │
│  │ 2 projects          │            │ paper  │
│  └──────────────────────────────────────────┘│
│                                              │
│  🇮🇳 Indian Context:                          │
│  Exams: GATE CS                              │
│  Targets: Google Research, Microsoft Res.     │
│  Salary: ₹12-25 LPA (fresher)                │
└──────────────────────────────────────────────┘
```

**3D Pin Card effect** (from Aceternity):
- Card tilts subtly following mouse position (`rotateX`, `rotateY` based on cursor)
- Glowing border on hover
- Shadow depth increases on hover

**Print/Save functionality:**
- Export as PDF button (using `html2canvas` + `jsPDF`)
- Share as image button

### 4. Project Structure (Frontend)

```
frontend/
├── app/
│   ├── layout.tsx            # Providers, fonts, metadata
│   ├── page.tsx              # Main multi-step page
│   └── globals.css           # Tailwind imports + custom animations
├── components/
│   ├── ui/                   # Shadcn components (button, card, slider, input, badge, etc.)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── steps/
│   │   ├── Step1_VibeCheck.tsx
│   │   ├── Step2_AcademicProfile.tsx
│   │   ├── Step3_ChatInterface.tsx
│   │   └── Step4_ReportReveal.tsx
│   ├── Carousel3D.tsx
│   ├── FieldCard.tsx
│   ├── ChatBubble.tsx
│   ├── TypingIndicator.tsx
│   ├── AnalyzeOverlay.tsx
│   ├── PathCard.tsx
│   ├── AnimatedProgressBar.tsx
│   └── RoadmapTimeline.tsx
├── context/
│   ├── SessionContext.tsx     # Session ID, step, all form data
│   └── ChatContext.tsx        # Messages array, streaming state
├── hooks/
│   ├── useSSE.ts             # Server-Sent Events hook
│   └── useAnimatedSlider.ts  # Framer Motion slider logic
├── lib/
│   ├── api.ts                # All API calls
│   └── utils.ts              # cn(), formatters
├── types/
│   └── index.ts              # All TypeScript types/interfaces
├── public/
│   └── fonts/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

### 5. Data Flow

```
User clicks "Next" on Step 1
  ↓
POST /api/vibe/select { field }
  ↓
AnimatePresence slides Step1 out, Step2 in
  ↓
User fills profile, clicks "Start Assessment"
  ↓
POST /api/profile/submit { form data }
  ↓
Session updated with profile context
  ↓
AnimatePresence slides Step2 out, Step3 in
  ↓
AI sends first chat message (pre-prompted)
  ↓ (streaming SSE)
User chats back and forth (minimum 3-4 exchanges)
  ↓
User clicks "Show My Results"
  ↓
POST /api/report/generate
  ↓ (streaming SSE — analysis animation plays during stream)
  ↓
Report parsed → Step 4 reveal
```

### 6. State Management

**SessionContext shape:**
```typescript
interface SessionState {
  sessionId: string | null;
  currentStep: 1 | 2 | 3 | 4;
  direction: "left" | "right"; // for slide animation direction
  selectedField: string | null;
  profile: ProfileData | null;
}

type ProfileData = {
  class10Percentage: number;
  stream12: "Science" | "Commerce" | "Arts";
  class12Percentage: number;
  entranceExam: string;
  entranceScore: number;
  currentEducation: string;
  college?: string;
  location: string;
  languages: string[];
};
```

**ChatContext shape:**
```typescript
interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
```

---

## III. IMPLEMENTATION ORDER

### Sprint 1 (Week 1) — Backend Foundation

| Day | Task |
|-----|------|
| 1   | Initialize FastAPI project, install dependencies (fastapi, uvicorn, httpx, ollama) |
| 2   | Implement `OllamaClient` service with async streaming |
| 3   | Implement `SessionStore` (in-memory) + `POST /api/session/create` |
| 4   | Implement all prompt templates (system, vibe, profile, chat, report) |
| 5   | Implement vibe + profile endpoints |
| 6   | Implement chat SSE streaming endpoint |
| 7   | Implement report generation endpoint; test full flow with curl |

### Sprint 2 (Week 2) — Frontend Scaffold + Step 1 & 2

| Day | Task |
|-----|------|
| 1   | `npx create-next-app`, install deps (framer-motion, tailwind, shadcn, lucide) |
| 2   | Set up Shadcn components, theme, global CSS animations |
| 3   | Implement `SessionContext` + `AnimatedProgressBar` |
| 4   | Implement `Carousel3D` + `FieldCard` for Step 1 |
| 5   | Implement Step 2 form with animated sliders |
| 6   | Wire Step 1 & 2 to backend APIs |
| 7   | Polish transitions between steps (AnimatePresence) |

### Sprint 3 (Week 3) — Step 3 Chat + Step 4 Report

| Day | Task |
|-----|------|
| 1   | Implement `ChatContext` + `MessageBubble` component |
| 2   | Implement SSE consumption hook (`useSSE`) |
| 3   | Build `TypingIndicator` + `ChatInput` |
| 4   | Build `AnalyzeOverlay` animation (full-screen analysis effect) |
| 5   | Build `PathCard` with Aceternity 3D tilt effect |
| 6   | Build `RoadmapTimeline` component |
| 7   | Wire Step 4 to report endpoint; full end-to-end test |

### Sprint 4 (Week 4) — Polish & Edge Cases

| Day | Task |
|-----|------|
| 1   | Mobile responsiveness audit |
| 2   | Loading states, error handling, retry logic |
| 3   | Prompt refinement — test with real Ollama responses |
| 4   | Context window management (truncation strategy) |
| 5   | Edge cases: empty responses, network failure, invalid inputs |
| 6   | Performance profiling + optimization |
| 7   | Final integration test + README |

---

## IV. DEPLOYMENT & PACKAGING

Since everything runs locally:

```
careercons/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── run.py              # python run.py → starts FastAPI on :8000
│   └── ...
├── frontend/
│   ├── package.json
│   └── ...
├── start.sh                # Starts Ollama + backend + frontend
└── README.md
```

**start.sh (single command launch):**
```bash
#!/bin/bash
ollama serve &
sleep 2
cd backend && python main.py &
cd frontend && npm run dev &
wait
```

---

## V. PROMPT REFINEMENT STRATEGY

1. **Baseline:** Test each prompt with 5 sample user journeys
2. **Evaluate:** Does the output contain Indian-specific references? Concrete roadmaps? Salary ranges?
3. **If not:** Add explicit instructions with examples to the prompt
4. **Loop:** Re-test until outputs consistently meet quality bar

**Key prompt patterns to enforce:**
- "Respond ONLY with a JSON object..." (for report endpoint)
- "Give 3 specific Indian exam names, not generic 'competitive exams'"
- "Mention at least one Indian company by name in each path"
- "If the user mentions a city, include colleges/opportunities in or near that city"
