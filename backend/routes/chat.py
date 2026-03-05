from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from services.gemini_service import chat_with_nutrisync

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Personal 24/7 AI health assistant chatbot.
    """
    try:
        print(f"Chat Request: {request.message}")
        print(f"History Type: {type(request.history)}")
        response = chat_with_nutrisync(request.message, request.history)
        return {"response": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
