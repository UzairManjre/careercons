from fastapi import APIRouter, HTTPException
from schemas.session import CreateSessionResponse, SessionStateResponse
from services.session_store import session_store

router = APIRouter()

@router.post("/session/create", response_model=CreateSessionResponse)
async def create_session():
    sid = session_store.create()
    return CreateSessionResponse(session_id=sid)

@router.get("/session/{session_id}/state", response_model=SessionStateResponse)
async def get_session_state(session_id: str):
    session = session_store.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionStateResponse(
        current_step=session.current_step,
        selected_field=session.selected_field,
        profile_data=session.profile_data,
        chat_history=session.chat_history,
    )
