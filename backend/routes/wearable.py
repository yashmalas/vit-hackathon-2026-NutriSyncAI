from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.supabase_service import log_wearable_vitals
import datetime

router = APIRouter()

class WearableData(BaseModel):
    heart_rate: Optional[int] = None
    blood_pressure: Optional[str] = None
    spo2: Optional[int] = None
    steps: Optional[int] = None
    timestamp: Optional[str] = None

DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

@router.post("/sync-vitals")
async def sync_vitals(data: WearableData, x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        vitals_dict = data.dict(exclude_none=True)
        if "timestamp" not in vitals_dict:
            vitals_dict["timestamp"] = datetime.datetime.utcnow().isoformat()
            
        res = log_wearable_vitals(user_id, vitals_dict)
        return {"message": "Bio-vitals pushed to cloud.", "entry": res}
    except Exception as e:
        print(f"Wearable Sync Error: {e}")
        return {"message": "Node sync latency detected.", "error": str(e)}
