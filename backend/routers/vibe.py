from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.session_store import session_store
from services.prompt_manager import prompt_manager

router = APIRouter()

class VibeSelectRequest(BaseModel):
    session_id: str
    selected_field: str

@router.post("/vibe/select")
async def select_vibe(body: VibeSelectRequest):
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session_store.update(body.session_id, selected_field=body.selected_field, current_step=2)
    return {"status": "ok", "selected_field": body.selected_field}
