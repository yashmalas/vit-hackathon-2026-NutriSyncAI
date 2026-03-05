from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from services.supabase_service import get_health_profile, upsert_health_profile

router = APIRouter()

class HealthProfile(BaseModel):
    full_name: Optional[str] = "New Citizen"
    email: Optional[str] = None
    age: Optional[int] = 25
    weight: Optional[float] = 70.0
    height: Optional[float] = 175.0
    goal: Optional[str] = "Maintenance"
    activity_level: Optional[str] = "Moderate"
    bio_id: Optional[str] = "NS-X99-ALPHA"
    heart_rate: Optional[int] = 77
    blood_pressure: Optional[str] = "120/80"

# Default ID for demo if no header provided
DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

@router.get("/me")
async def get_my_profile(x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        profile = get_health_profile(user_id)
        if not profile:
            # Return defaults if no profile found in DB
            return {
                "full_name": "New Citizen",
                "email": "user@nutrisync.ai",
                "age": 25,
                "weight": 70,
                "height": 175,
                "goal": "Maintenance",
                "activity_level": "Moderate",
                "bio_id": "NS-X99-ALPHA"
            }
        return profile
    except Exception as e:
        print(f"Supabase Read Error: {e}")
        return {"error": "Database link unstable", "status": "offline"}

@router.put("/update")
async def update_profile(profile: HealthProfile, x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        data = profile.dict(exclude_none=True)
        updated = upsert_health_profile(user_id, data)
        return {"message": "Bio-data synced to Supabase", "profile": updated}
    except Exception as e:
        print(f"Supabase Update Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to sync neural profile")
