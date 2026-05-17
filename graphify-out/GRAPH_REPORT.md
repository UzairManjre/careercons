# Graph Report - .  (2026-05-18)

## Corpus Check
- Corpus is ~35,248 words - fits in a single context window. You may not need a graph.

## Summary
- 652 nodes · 961 edges · 55 communities (45 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Session State Management|Session State Management]]
- [[_COMMUNITY_Session Database Storage|Session Database Storage]]
- [[_COMMUNITY_Poppy App Architecture|Poppy App Architecture]]
- [[_COMMUNITY_Frontend NPM Dependencies|Frontend NPM Dependencies]]
- [[_COMMUNITY_Session Data Indices|Session Data Indices]]
- [[_COMMUNITY_Academic Profile Fields|Academic Profile Fields]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Algorithmic Art Engine|Algorithmic Art Engine]]
- [[_COMMUNITY_UI Component Library|UI Component Library]]
- [[_COMMUNITY_Page Routes & API|Page Routes & API]]
- [[_COMMUNITY_Career Path Cards|Career Path Cards]]
- [[_COMMUNITY_Vibe Check & Field Cards|Vibe Check & Field Cards]]
- [[_COMMUNITY_Academic Profile Inputs|Academic Profile Inputs]]
- [[_COMMUNITY_Backend API Schemas|Backend API Schemas]]
- [[_COMMUNITY_Session Orchestrator|Session Orchestrator]]
- [[_COMMUNITY_Image Analysis Router|Image Analysis Router]]
- [[_COMMUNITY_Chat Router|Chat Router]]
- [[_COMMUNITY_Profile Router|Profile Router]]
- [[_COMMUNITY_Vibe Router|Vibe Router]]
- [[_COMMUNITY_Report Router|Report Router]]
- [[_COMMUNITY_Session Router|Session Router]]
- [[_COMMUNITY_Prompt Management|Prompt Management]]
- [[_COMMUNITY_Chat Context|Chat Context]]
- [[_COMMUNITY_Ollama Client Service|Ollama Client Service]]
- [[_COMMUNITY_Animation Utilities|Animation Utilities]]
- [[_COMMUNITY_UI Utility Functions|UI Utility Functions]]
- [[_COMMUNITY_Transition Animations|Transition Animations]]
- [[_COMMUNITY_Chat Interface Step|Chat Interface Step]]
- [[_COMMUNITY_Report Reveal Step|Report Reveal Step]]
- [[_COMMUNITY_Typing Indicator|Typing Indicator]]
- [[_COMMUNITY_Analyze Overlay|Analyze Overlay]]
- [[_COMMUNITY_Journey Report|Journey Report]]
- [[_COMMUNITY_Badge Component|Badge Component]]
- [[_COMMUNITY_OpenCode Plugin Config|OpenCode Plugin Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Next.js Env Types|Next.js Env Types]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Plan Document|Plan Document]]
- [[_COMMUNITY_Algorithmic Art Skill|Algorithmic Art Skill]]
- [[_COMMUNITY_Find Skills Docs|Find Skills Docs]]
- [[_COMMUNITY_Chat Prompt|Chat Prompt]]
- [[_COMMUNITY_Chat JSON Prompt|Chat JSON Prompt]]
- [[_COMMUNITY_README|README]]
- [[_COMMUNITY_Router Init|Router Init]]
- [[_COMMUNITY_Schema Init|Schema Init]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 24 edges
2. `profile_data` - 17 edges
3. `motivation` - 17 edges
4. `academic_strengths` - 17 edges
5. `academic_weaknesses` - 17 edges
6. `extracurricular` - 17 edges
7. `lifestyle_preferences` - 17 edges
8. `role_models` - 17 edges
9. `concerns` - 17 edges
10. `work_environment` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Backend Architecture` --references--> `FastAPI Dependency`  [INFERRED]
  PLAN.md → backend/requirements.txt
- `Backend Architecture` --references--> `httpx Dependency`  [INFERRED]
  PLAN.md → backend/requirements.txt
- `cn()` --calls--> `clsx`  [INFERRED]
  frontend/lib/utils.ts → frontend/package.json
- `Poppy UI Application` --conceptually_related_to--> `Poppy Career Counseling App`  [INFERRED]
  poppy-ui.html → PLAN.md
- `Prompt Chaining Architecture` --calls--> `Poppy System Prompt`  [EXTRACTED]
  PLAN.md → backend/prompts/system.md

## Hyperedges (group relationships)
- **Four-Step Interview Flow** — plan_vibe_check, plan_academic_profile, plan_chat_interface, plan_report_reveal [EXTRACTED 1.00]
- **Prompt Chaining Pipeline** — prompt_system, prompt_vibe, prompt_profile_analysis, prompt_chat, prompt_report_generation [EXTRACTED 1.00]
- **Backend Technology Stack** — plan_fastapi, plan_ollama, plan_gemma_2b, plan_pydantic, plan_sse_streaming, plan_session_manager, plan_api_endpoints [INFERRED 0.90]
- **Frontend Technology Stack** — plan_next_js, plan_tailwind_css, plan_shadcn_ui, plan_framer_motion [INFERRED 0.90]

## Communities (55 total, 10 thin omitted)

### Community 0 - "Session State Management"
Cohesion: 0.05
Nodes (101): user_model, 2a155a55-2083-4c0e-85f7-c79f6e1bec5a, answers, chat_history, created_at, current_step, discovery_phase, last_active (+93 more)

### Community 1 - "Session Database Storage"
Cohesion: 0.05
Nodes (36): 0bc1740e-3f56-4845-a564-c87091478988, answers, chat_history, current_step, discovery_phase, profile_data, question_index, selected_field (+28 more)

### Community 2 - "Poppy App Architecture"
Cohesion: 0.06
Nodes (33): Academic Profile Step, API Endpoints, Backend Architecture, Six Career Fields, Career Report Structure, Chat Interface Step, FastAPI Framework, Framer Motion (+25 more)

### Community 3 - "Frontend NPM Dependencies"
Cohesion: 0.07
Nodes (28): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, @radix-ui/react-label, @radix-ui/react-slot (+20 more)

### Community 4 - "Session Data Indices"
Cohesion: 0.08
Nodes (24): 0, 1, 2, 3, 4, 5, 6, 7 (+16 more)

### Community 5 - "Academic Profile Fields"
Cohesion: 0.34
Nodes (20): profile_data, profile_data, profile_data, profile_data, biggest_worry, career_values, class_10_percentage, class_12_percentage (+12 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Algorithmic Art Engine"
Cohesion: 0.11
Nodes (5): Entity, initializeSeed(), params, regenerate(), setup()

### Community 8 - "UI Component Library"
Cohesion: 0.17
Nodes (13): cn(), DialogContent(), DialogContentProps, DialogDescription(), DialogHeader(), DialogProps, DialogTitle(), Select() (+5 more)

### Community 9 - "Page Routes & API"
Cohesion: 0.15
Nodes (13): ReportHistoryModalProps, AnimatedProgressBar(), steps, ChatEvent, createSession(), data, decoder, getReportHistory() (+5 more)

### Community 10 - "Career Path Cards"
Cohesion: 0.14
Nodes (13): medals, PathCardProps, springGentle, RoadmapPhase, RoadmapTimeline(), RoadmapTimelineProps, CareerPath, Card (+5 more)

### Community 11 - "Vibe Check & Field Cards"
Cohesion: 0.14
Nodes (13): AnalysisResult, cardVariants, Carousel3D(), Carousel3DProps, fields, springTransition, FieldCard(), FieldCardProps (+5 more)

### Community 12 - "Academic Profile Inputs"
Cohesion: 0.13
Nodes (14): careerValuesList, careerWorryOptions, educationOptions, hobbiesList, sliderFields, Step2_AcademicProfile(), Step2Props, streams (+6 more)

### Community 13 - "Backend API Schemas"
Cohesion: 0.14
Nodes (10): BaseModel, create_session(), get_session_state(), VibeSelectRequest, ChatRequest, ProfileRequest, ReportRequest, SaveReportRequest (+2 more)

### Community 14 - "Session Orchestrator"
Cohesion: 0.23
Nodes (4): Orchestrator, SessionState, SessionStore, UserModel

### Community 15 - "Image Analysis Router"
Cohesion: 0.14
Nodes (4): JourneyReportProps, smooth, spring, springBouncy

### Community 16 - "Chat Router"
Cohesion: 0.15
Nodes (13): 4f40e538-8623-4b16-9fd9-362ead2caca1, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 17 - "Profile Router"
Cohesion: 0.15
Nodes (13): 2c6fe24e-ea68-4661-9b96-49206301dba0, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 18 - "Vibe Router"
Cohesion: 0.15
Nodes (13): 2f0eb484-1189-4a6e-b73b-16399c6b3bf8, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 19 - "Report Router"
Cohesion: 0.15
Nodes (13): 38d0b86f-a6ac-4e5c-bf21-6b9db4860f28, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 20 - "Session Router"
Cohesion: 0.15
Nodes (13): 890e8049-9bfb-4311-b7ec-3c6bba100e88, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 21 - "Prompt Management"
Cohesion: 0.15
Nodes (13): f30f5b12-1ee9-4cc6-ac39-071c63239a84, answers, chat_history, created_at, current_step, discovery_phase, last_active, profile_data (+5 more)

### Community 22 - "Chat Context"
Cohesion: 0.17
Nodes (12): 614055d0-2370-458d-a25d-3ef58af7fb8a, answers, chat_history, created_at, current_step, discovery_phase, last_active, question_index (+4 more)

### Community 23 - "Ollama Client Service"
Cohesion: 0.2
Nodes (8): ChatAction, ChatContext, ChatProvider(), initialChatState, ChatState, Message, ProfileData, Report

### Community 24 - "Animation Utilities"
Cohesion: 0.21
Nodes (10): PoppyApp(), TypingIndicator(), useSession(), startChat(), submitAnswer(), DisplayEntry, getQuickOptions(), PHASE_LABELS (+2 more)

### Community 25 - "UI Utility Functions"
Cohesion: 0.18
Nodes (10): ChatBubble(), ChatBubbleProps, fadeIn, fadeUp, pulseSpring, scaleIn, slideRight, springBouncy (+2 more)

### Community 26 - "Transition Animations"
Cohesion: 0.2
Nodes (9): AnalyzeOverlay(), AnalyzeOverlayProps, statusMessages, JourneyReport(), saveReport(), streamReport(), Step4_ReportReveal(), Step4Props (+1 more)

### Community 27 - "Chat Interface Step"
Cohesion: 0.22
Nodes (8): get_report_history(), get_test_report(), inject_dummy_report(), Inject a pre-generated high-fidelity dummy report into a sandbox session, Save the generated report to session for historical access, Get all saved reports across sessions, Get a test/dummy report for UI testing, save_report()

### Community 28 - "Report Reveal Step"
Cohesion: 0.22
Nodes (3): OllamaClient, Stream image analysis using the vision model via /api/chat, Analyze an image using the vision model via /api/chat

### Community 29 - "Typing Indicator"
Cohesion: 0.25
Nodes (8): Algorithmic Art Skill, Algorithmic Philosophy, Anthropic Branding Guidelines, Generative Art, p5.js Library, Seeded Randomness, Flow Field Particle System, Generative Art Viewer Template

### Community 30 - "Analyze Overlay"
Cohesion: 0.29
Nodes (5): initialState, SessionAction, SessionContext, SessionProvider(), SessionState

### Community 31 - "Journey Report"
Cohesion: 0.33
Nodes (4): inter, jetbrainsMono, metadata, spaceGrotesk

### Community 32 - "Badge Component"
Cohesion: 0.4
Nodes (5): analyze_image(), analyze_image_stream(), normalize_field(), Stream image analysis response, Analyze uploaded image and suggest career field, verifying if they should pursue

### Community 34 - "PostCSS Config"
Cohesion: 0.5
Nodes (3): parse_llm_json(), Robust parser to extract JSON content even if wrapped in markdown blocks or slig, start_chat()

### Community 35 - "ESLint Config"
Cohesion: 0.5
Nodes (4): disclaimer, summary, top_3_paths, report

### Community 36 - "Tailwind Config"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 39 - "Plan Document"
Cohesion: 0.67
Nodes (3): Find Skills Skill, Skills CLI Tool, skills.sh Registry

## Knowledge Gaps
- **357 isolated node(s):** `@opencode-ai/plugin`, `params`, `session_id`, `current_step`, `selected_field` (+352 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Component Library` to `Frontend NPM Dependencies`, `Tailwind Config`, `Career Path Cards`, `Vibe Check & Field Cards`, `Academic Profile Inputs`, `UI Utility Functions`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `bbd135f3-dcae-4d50-887b-af794b82b367` connect `Session State Management` to `Session Database Storage`, `Session Data Indices`, `Academic Profile Fields`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `@opencode-ai/plugin`, `params`, `session_id` to the rest of the system?**
  _366 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Session State Management` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Session Database Storage` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Poppy App Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Frontend NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._