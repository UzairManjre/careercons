from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
from schemas.chat import ChatRequest
from services.session_store import session_store
from services.ollama_client import ollama
from services.prompt_manager import prompt_manager
from services.orchestrator import orchestrator, PHASE_SYNTHESIS
from config import settings
import json
import re
import asyncio

router = APIRouter()

def parse_llm_json(response_text: str) -> dict:
    """Robust parser to extract JSON content even if wrapped in markdown blocks or slightly malformed"""
    clean = response_text.strip()
    
    # 1. Extract content inside code blocks if present
    code_block_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', clean, re.DOTALL)
    if code_block_match:
        clean = code_block_match.group(1).strip()
    else:
        json_match = re.search(r'(\{.*\})', clean, re.DOTALL)
        if json_match:
            clean = json_match.group(1).strip()

    # 2. Fix unescaped double quotes inside key-value pairs (like "acknowledgment": "That's "great"!")
    ack_match = re.search(r'("acknowledgment"\s*:\s*")(.*?)("\s*,\s*"options")', clean, re.DOTALL)
    if ack_match:
        prefix, content, suffix = ack_match.groups()
        fixed_content = re.sub(r'(?<!\\)"', r"'", content)
        clean = clean.replace(ack_match.group(0), prefix + fixed_content + suffix)

    # Try standard parsing first
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        pass

    # 3. Handle minor truncation by completing open structures
    if clean.endswith(','):
        clean = clean[:-1]
    if not clean.endswith('}'):
        if clean.endswith(']'):
            clean += '}'
        else:
            open_braces = clean.count('{')
            close_braces = clean.count('}')
            open_brackets = clean.count('[')
            close_brackets = clean.count(']')
            
            if open_brackets > close_brackets:
                clean += ']'
            if open_braces > close_braces:
                clean += '}'

    return json.loads(clean)

@router.post("/chat/start")
async def start_chat(body: ChatRequest):
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.chat_history = []
    session.discovery_phase = "foundation"
    session.question_index = 0
    session.answers = {}

    q_data = orchestrator.get_current_question(session, {})
    if q_data is None:
        raise HTTPException(status_code=500, detail="Failed to generate first question")

    session.question_index = q_data["id"] + 1
    session.chat_history.append({"role": "assistant", "content": q_data["question"]})

    # Generate initial dynamic options for the very first question!
    options = []
    try:
        answered_summary = "No answers yet"
        profile_summary = json.dumps(session.profile_data, indent=2) if session.profile_data else "Not provided"
        
        system_prompt = prompt_manager.render("chat_json",
            discovery_phase=session.discovery_phase,
            current_question=q_data["question"],
            previous_answers_summary=answered_summary,
            selected_field=session.selected_field or "Not selected",
            profile_summary=profile_summary,
        )
        
        response_text = await ollama.generate(
            messages=[{"role": "user", "content": "Generate the dynamic JSON now."}],
            system=system_prompt,
            num_predict=settings.num_predict_chat,
            format="json",
        )
        
        parsed_data = parse_llm_json(response_text)
        options = parsed_data.get("options", [])
    except Exception as e:
        print(f"[First Question Options Generation Error]: {e}")

    # Persist the dynamic session initialization to disk
    session_store.save_to_disk()

    return {
        "type": "question",
        "question": q_data["question"],
        "question_index": q_data["id"],
        "phase": session.discovery_phase,
        "options": options,
    }

@router.post("/chat/answer")
async def submit_answer(body: ChatRequest):
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.discovery_phase == PHASE_SYNTHESIS:
        async def complete_stream():
            yield f"data: {json.dumps({'type': 'interview_complete', 'done': True})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'done': True})}\n\n"
        return StreamingResponse(complete_stream(), media_type="text/event-stream")

    prev_q_index = session.question_index - 1
    session.answers[prev_q_index] = body.message
    session.chat_history.append({"role": "user", "content": body.message})

    trait_assoc = ["motivation", "academic_mapping", "extracurricular", "lifestyle",
                   "role_models", "concerns", "path_matching", "work_environment",
                   "values", "aspiration"]
    if prev_q_index < len(trait_assoc):
        orchestrator.extract_trait(body.message, trait_assoc[prev_q_index], session.user_model)

    next_q = orchestrator.get_current_question(session, session.answers)

    # If all 10 questions are completed, emit a stream indicating interview_complete and save session!
    if next_q is None:
        session.discovery_phase = PHASE_SYNTHESIS
        session_store.save_to_disk()
        
        async def complete_stream():
            yield f"data: {json.dumps({'type': 'interview_complete', 'done': True})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'done': True})}\n\n"
            
        return StreamingResponse(complete_stream(), media_type="text/event-stream")

    answered_summary = "\n".join(
        f"Q{k}: {v[:100]}..." for k, v in sorted(session.answers.items())
    )
    profile_summary = json.dumps(session.profile_data, indent=2) if session.profile_data else "Not provided"

    # Ask the LLM to generate a JSON object containing both the acknowledgment string and the options list
    system_prompt = prompt_manager.render("chat_json",
        discovery_phase=session.discovery_phase,
        current_question=next_q["question"],
        previous_answers_summary=answered_summary or "No answers yet",
        selected_field=session.selected_field or "Not selected",
        profile_summary=profile_summary,
    )

    async def event_stream():
        try:
            print(f"\n[Dynamic LLM JSON Generation Start]")
            response_text = await ollama.generate(
                messages=[{"role": "user", "content": f"Generate JSON for user reply: '{body.message}'"}],
                system=system_prompt,
                num_predict=settings.num_predict_chat,
                format="json",
            )
            print(f"[Dynamic LLM JSON Generation End]")
            
            parsed_data = parse_llm_json(response_text)
            ack_val = parsed_data.get("acknowledgment", "").strip()
            
            # Combine the LLM-personalized acknowledgment with our core orchestrator question!
            if ack_val:
                ack_text = f"{ack_val} {next_q['question']}"
            else:
                ack_text = next_q['question']
                
            options = parsed_data.get("options", [])
        except Exception as e:
            print(f"[LLM JSON Generation Error - Falling back]: {e}")
            ack_text = f"Thank you for sharing! That is wonderful context. Let's keep exploring. {next_q['question']}"
            options = []

        # Stream the acknowledgment text word-by-word with a perfect, smooth delay!
        words = ack_text.split(" ")
        for i, word in enumerate(words):
            token = word + (" " if i < len(words) - 1 else "")
            yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
            await asyncio.sleep(0.035)

        session.chat_history.append({"role": "assistant", "content": ack_text})

        # Yield the final question event populated with the dynamic options parsed from the JSON!
        yield f"data: {json.dumps({'type': 'question', 'question': next_q['question'], 'question_index': next_q['id'], 'phase': session.discovery_phase, 'options': options})}\n\n"
        yield f"data: {json.dumps({'type': 'done', 'done': True})}\n\n"

        session.question_index = next_q["id"] + 1
        session_store.save_to_disk()

    return StreamingResponse(event_stream(), media_type="text/event-stream")
