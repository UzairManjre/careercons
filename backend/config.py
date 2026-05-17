from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ollama_host: str = "http://localhost:11434"
    model_name: str = "gemma4:e2b"
    vision_model: str = "gemma4:e2b"
    session_timeout_minutes: int = 60
    max_context_tokens: int = 32000
    num_predict_chat: int = 1024
    num_predict_report: int = 4096
    temperature: float = 0.7

settings = Settings()
