from pathlib import Path
from config import settings

PROMPT_DIR = Path(__file__).parent.parent / "prompts"

class PromptManager:
    def __init__(self):
        self._cache: dict[str, str] = {}

    def load(self, name: str) -> str:
        if name not in self._cache:
            path = PROMPT_DIR / f"{name}.md"
            if path.exists():
                self._cache[name] = path.read_text(encoding="utf-8")
            else:
                self._cache[name] = ""
        return self._cache[name]

    def render(self, name: str, **kwargs) -> str:
        template = self.load(name)
        for k, v in kwargs.items():
            template = template.replace(f"{{{{{k}}}}}", str(v))
        return template

    def truncate_history(self, history: list[dict], max_tokens: int | None = None) -> list[dict]:
        limit = max_tokens or settings.max_context_tokens
        total = sum(len(m.get("content", "")) for m in history)
        while total > limit and len(history) > 4:
            removed = history.pop(0)
            total -= len(removed.get("content", ""))
        return history

prompt_manager = PromptManager()
