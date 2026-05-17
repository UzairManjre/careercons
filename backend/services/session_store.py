from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
import json
import uuid

PERSIST_FILE = Path(__file__).parent.parent / "sessions_db.json"

@dataclass
class UserModel:
    motivation: str = ""
    academic_strengths: list[str] = field(default_factory=list)
    academic_weaknesses: list[str] = field(default_factory=list)
    extracurricular: list[str] = field(default_factory=list)
    lifestyle_preferences: str = ""
    role_models: str = ""
    concerns: str = ""
    work_environment: str = ""
    values_priority: str = ""
    aspiration: str = ""
    matched_paths_hints: list[str] = field(default_factory=list)

@dataclass
class SessionState:
    session_id: str
    current_step: int = 1  # 1=vibe, 2=profile, 3=chat(interview), 4=report
    selected_field: str | None = None
    profile_data: dict | None = None
    chat_history: list[dict] = field(default_factory=list)
    discovery_phase: str = "foundation"  # foundation | deep_dive | synthesis
    question_index: int = 0
    total_questions: int = 10
    answers: dict[int, str] = field(default_factory=dict)
    user_model: UserModel = field(default_factory=UserModel)
    report: dict | None = None  # Final career report
    created_at: datetime = field(default_factory=datetime.now)
    last_active: datetime = field(default_factory=datetime.now)

class SessionStore:
    def __init__(self):
        self._sessions: dict[str, SessionState] = {}
        self.load_from_disk()

    def load_from_disk(self):
        try:
            if PERSIST_FILE.exists():
                data = json.loads(PERSIST_FILE.read_text(encoding="utf-8"))
                for sid, sdata in data.items():
                    um_data = sdata.get("user_model", {})
                    um = UserModel(**um_data)
                    
                    created_at = datetime.fromisoformat(sdata["created_at"]) if "created_at" in sdata else datetime.now()
                    last_active = datetime.fromisoformat(sdata["last_active"]) if "last_active" in sdata else datetime.now()
                    
                    self._sessions[sid] = SessionState(
                        session_id=sdata["session_id"],
                        current_step=sdata.get("current_step", 1),
                        selected_field=sdata.get("selected_field"),
                        profile_data=sdata.get("profile_data"),
                        chat_history=sdata.get("chat_history", []),
                        discovery_phase=sdata.get("discovery_phase", "foundation"),
                        question_index=sdata.get("question_index", 0),
                        total_questions=sdata.get("total_questions", 10),
                        answers={int(k): v for k, v in sdata.get("answers", {}).items()},
                        user_model=um,
                        report=sdata.get("report"),
                        created_at=created_at,
                        last_active=last_active,
                    )
        except Exception as e:
            print(f"Error loading sessions from disk: {e}")

    def save_to_disk(self):
        try:
            data = {}
            for sid, session in self._sessions.items():
                data[sid] = {
                    "session_id": session.session_id,
                    "current_step": session.current_step,
                    "selected_field": session.selected_field,
                    "profile_data": session.profile_data,
                    "chat_history": session.chat_history,
                    "discovery_phase": session.discovery_phase,
                    "question_index": session.question_index,
                    "total_questions": session.total_questions,
                    "answers": session.answers,
                    "user_model": asdict(session.user_model),
                    "report": session.report,
                    "created_at": session.created_at.isoformat(),
                    "last_active": session.last_active.isoformat(),
                }
            PERSIST_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")
        except Exception as e:
            print(f"Error saving sessions to disk: {e}")

    def create(self) -> str:
        sid = str(uuid.uuid4())
        self._sessions[sid] = SessionState(session_id=sid)
        self.save_to_disk()
        return sid

    def get(self, session_id: str) -> SessionState:
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionState(session_id=session_id)
            self.save_to_disk()
        session = self._sessions[session_id]
        session.last_active = datetime.now()
        self.save_to_disk()
        return session

    def update(self, session_id: str, **kwargs):
        session = self.get(session_id)
        for k, v in kwargs.items():
            setattr(session, k, v)
        session.last_active = datetime.now()
        self.save_to_disk()

session_store = SessionStore()
