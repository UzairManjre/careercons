import httpx
import json
import base64
import sys
from config import settings

class OllamaClient:
    def __init__(self):
        self.base_url = settings.ollama_host
        self.model = settings.model_name
        self.client = httpx.AsyncClient(timeout=120.0)

    async def generate_stream(self, messages: list[dict], system: str = "", num_predict: int | None = None, format: str | None = None):
        options = {
            "temperature": settings.temperature,
            "num_predict": num_predict or settings.num_predict_chat,
        }
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "stream": True,
            "options": options,
        }
        if format:
            payload["format"] = format
        
        print(f"\n[Ollama Chat Stream Start - Model: {self.model}]")
        async with self.client.stream("POST", f"{self.base_url}/api/chat", json=payload) as resp:
            async for line in resp.aiter_lines():
                if line.strip():
                    data = json.loads(line)
                    if "message" in data:
                        token = data["message"]["content"]
                        sys.stdout.write(token)
                        sys.stdout.flush()
                        yield token
                    if data.get("done"):
                        break
        print("\n[Ollama Chat Stream End]\n")

    async def generate(self, messages: list[dict], system: str = "", num_predict: int | None = None, format: str | None = None) -> str:
        options = {
            "temperature": settings.temperature,
            "num_predict": num_predict or settings.num_predict_report,
        }
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system}] + messages,
            "stream": False,
            "options": options,
        }
        if format:
            payload["format"] = format
        
        print(f"\n[Ollama Chat Generate Start - Model: {self.model}]")
        resp = await self.client.post(f"{self.base_url}/api/chat", json=payload)
        data = resp.json()
        
        content = data.get("message", {}).get("content", "")
        print(f"Generated Output:\n{content}")
        print("[Ollama Chat Generate End]\n")
        return content

    async def analyze_image(self, image_base64: str, prompt: str = "Describe this image.") -> str:
        """Analyze an image using the vision model via /api/chat"""
        from config import settings
        
        print(f"\n[Ollama VLM Start - Model: {settings.vision_model}]")
        print(f"[Ollama VLM] Image size: {len(image_base64)} chars")
        
        # Use /api/chat with Ollama vision format
        payload = {
            "model": settings.vision_model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "images": [image_base64]
                }
            ],
            "stream": False,
        }
        
        try:
            resp = await self.client.post(f"{self.base_url}/api/chat", json=payload)
            data = resp.json()
            
            if "error" in data:
                error_msg = data["error"].get("message", "") if isinstance(data["error"], dict) else str(data["error"])
                print(f"[Ollama VLM ERROR]: {error_msg}")
                raise Exception(error_msg)
                
            content = data.get("message", {}).get("content", "")
            print(f"VLM Analysis Output:\n{content[:200]}...")
            print("[Ollama VLM End]\n")
            return content
        except Exception as e:
            print(f"[Ollama VLM EXCEPTION]: {str(e)}")
            raise
 
    async def analyze_image_stream(self, image_base64: str, prompt: str = "Describe this image."):
        """Stream image analysis using the vision model via /api/chat"""
        from config import settings
        
        print(f"\n[Ollama VLM Stream Start - Model: {settings.vision_model}]")
        
        payload = {
            "model": settings.vision_model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt,
                    "images": [image_base64]
                }
            ],
            "stream": True,
        }
        
        async with self.client.stream("POST", f"{self.base_url}/api/chat", json=payload) as resp:
            async for line in resp.aiter_lines():
                if line.strip():
                    data = json.loads(line)
                    if "error" in data:
                        error_msg = data["error"].get("message", "") if isinstance(data["error"], dict) else str(data["error"])
                        print(f"\n[Ollama VLM STREAM ERROR]: {error_msg}")
                        yield f"ERROR: {error_msg}"
                    elif "message" in data:
                        token = data["message"].get("content", "")
                        yield token
                    if data.get("done"):
                        break
        print("\n[Ollama VLM Stream End]\n")

ollama = OllamaClient()
