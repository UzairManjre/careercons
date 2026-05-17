from fastapi import APIRouter, HTTPException
from schemas.profile import ProfileRequest
from services.session_store import session_store

router = APIRouter()

@router.post("/profile/submit")
async def submit_profile(body: ProfileRequest):
    session = session_store.get(body.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session_store.update(
        body.session_id,
        profile_data=body.model_dump(),
        current_step=3,
    )
    return {"status": "ok"}
