from fastapi import APIRouter, UploadFile, File, HTTPException
import base64
import json
import re
from services.ollama_client import ollama
from services.session_store import session_store

router = APIRouter()

IMAGE_ANALYSIS_PROMPT = """You are Poppy, an AI career counselor for Indian students. 

Analyze the uploaded image carefully. Look for:
- Books, textbooks, or study materials (what subjects?)
- Technology items (laptops, gadgets, coding setups)
- Creative tools (art supplies, musical instruments, cameras)
- Sports equipment or fitness gear
- Business/finance materials
- Medical/science equipment
- Personal items that reveal interests or values
- Desk organization style
- Any text visible in the image

Based on what you see, suggest which career field might suit this person best from these options:
- TECH & AI
- MEDICINE
- COMMERCE
- CREATIVE ARTS
- LAW & POLICY
- SCIENCES

We also want to confirm if they should or should not pursue their currently selected field: {selected_field_info}.

Respond in this JSON format ONLY (do not include any other text or markdown):
{{
  "suggested_field": "FIELD_NAME",
  "confidence": 0.5,
  "reasoning": "Brief explanation of what you saw and why it suggests this field",
  "secondary_suggestions": ["FIELD1", "FIELD2"],
  "should_pursue": true,
  "pursue_decision": "STRONGLY RECOMMEND",
  "pursue_explanation": "Explain clearly why they should or should not pursue this suggested/selected career path based on the item clues in the photo. Be supportive yet honest!"
}}

Be specific about what you observed in the image."""

def normalize_field(field: str) -> str:
    VALID_FIELDS = ["TECH & AI", "MEDICINE", "COMMERCE", "CREATIVE ARTS", "LAW & POLICY", "SCIENCES"]
    field_upper = str(field).upper().strip()
    
    for f in VALID_FIELDS:
        if f in field_upper or field_upper in f:
            return f
            
    mapping = {
        "TECH": "TECH & AI",
        "AI": "TECH & AI",
        "COMPUTERS": "TECH & AI",
        "CODING": "TECH & AI",
        "TECHNOLOGY": "TECH & AI",
        
        "MED": "MEDICINE",
        "HEALTH": "MEDICINE",
        "BIOLOGY": "MEDICINE",
        "CLINICAL": "MEDICINE",
        
        "BUSINESS": "COMMERCE",
        "FINANCE": "COMMERCE",
        "ECONOMICS": "COMMERCE",
        "MARKETING": "COMMERCE",
        
        "ART": "CREATIVE ARTS",
        "DESIGN": "CREATIVE ARTS",
        "MUSIC": "CREATIVE ARTS",
        "WRITING": "CREATIVE ARTS",
        "CREATIVE": "CREATIVE ARTS",
        
        "LAW": "LAW & POLICY",
        "POLICY": "LAW & POLICY",
        "JUSTICE": "LAW & POLICY",
        "SOCIETY": "LAW & POLICY",
        "SOCIETIES": "LAW & POLICY",
        "SOCIAL": "LAW & POLICY",
        
        "SCIENCE": "SCIENCES",
        "PHYSICS": "SCIENCES",
        "CHEMISTRY": "SCIENCES",
        "RESEARCH": "SCIENCES",
    }
    
    for key, val in mapping.items():
        if key in field_upper:
            return val
            
    return "TECH & AI"

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), selected_field: str | None = None):
    """Analyze uploaded image and suggest career field, verifying if they should pursue it"""
    try:
        content = await file.read()
        image_base64 = base64.b64encode(content).decode('utf-8')
        
        selected_field_info = f"'{selected_field}'" if selected_field else "their field of interest"
        prompt = IMAGE_ANALYSIS_PROMPT.format(selected_field_info=selected_field_info)
        
        analysis = await ollama.analyze_image(
            image_base64=image_base64,
            prompt=prompt
        )
        
        result = None
        json_match = re.search(r'\{.*\}', analysis, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
                
        if result is None:
            try:
                result = json.loads(analysis)
            except json.JSONDecodeError:
                result = {
                    "suggested_field": "TECH & AI",
                    "confidence": 0.5,
                    "reasoning": analysis,
                    "secondary_suggestions": [],
                    "should_pursue": True,
                    "pursue_decision": "STRONGLY RECOMMEND",
                    "pursue_explanation": "Based on what we see in the photo, this seems like a highly promising path for you!"
                }
        
        # Ensure our custom confirmation keys are populated
        if "should_pursue" not in result:
            result["should_pursue"] = result.get("confidence", 0.5) >= 0.6
        if "pursue_decision" not in result:
            result["pursue_decision"] = "STRONGLY RECOMMEND" if result["should_pursue"] else "PROCEED WITH CAUTION"
        if "pursue_explanation" not in result:
            result["pursue_explanation"] = result.get("reasoning", "The objects in your photo show a solid alignment with this career direction.")
            
        suggested = normalize_field(result.get("suggested_field", "TECH & AI"))
        result["suggested_field"] = suggested
        
        secondaries = []
        for f in result.get("secondary_suggestions", []):
            normalized = normalize_field(f)
            if normalized != suggested and normalized not in secondaries:
                secondaries.append(normalized)
        result["secondary_suggestions"] = secondaries
        
        return result
        
    except Exception as e:
        error_msg = str(e)
        if "MODEL_DOES_NOT_SUPPORT_IMAGES" in error_msg:
            raise HTTPException(
                status_code=400, 
                detail="Your Ollama model does not support image input. Please install a vision-capable model like llava, moondream, or llama3.2-vision, then update your config.py to use it."
            )
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {error_msg}")

@router.post("/analyze-image-stream")
async def analyze_image_stream(file: UploadFile = File(...), selected_field: str | None = None):
    """Stream image analysis response"""
    from fastapi.responses import StreamingResponse
    
    async def event_generator():
        try:
            content = await file.read()
            image_base64 = base64.b64encode(content).decode('utf-8')
            
            selected_field_info = f"'{selected_field}'" if selected_field else "their field of interest"
            prompt = IMAGE_ANALYSIS_PROMPT.format(selected_field_info=selected_field_info)
            
            async for token in ollama.analyze_image_stream(
                image_base64=image_base64,
                prompt=prompt
            ):
                yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
            
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
