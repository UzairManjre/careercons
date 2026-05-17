from pydantic import BaseModel

class CreateSessionResponse(BaseModel):
    session_id: str

class SessionStateResponse(BaseModel):
    current_step: int
    selected_field: str | None
    profile_data: dict | None
    chat_history: list[dict]
