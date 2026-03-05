from fastapi import APIRouter, HTTPException, Header
from services.gemini_service import get_insights_logic
from services.supabase_service import get_health_profile, save_ai_recommendation, fetch_ai_recommendations
from typing import Optional

router = APIRouter()

DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

@router.get("/analysis")
async def get_health_insights(x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        # Get profile from Supabase
        profile = get_health_profile(user_id)
        if not profile:
            profile = {"age": 25, "weight": 70, "height": 175, "goal": "Maintenance"}
            
        insights = get_insights_logic(profile)
        
        # Persist recommendations to ai_recommendations table
        if "recommendations" in insights:
            for rec in insights["recommendations"]:
                try:
                    save_ai_recommendation(user_id, {
                        "type": rec.get("type", "info"),
                        "title": rec.get("title", "Neural Insight"),
                        "description": rec.get("desc", ""),
                        "raw_data": rec
                    })
                except Exception as e:
                    print(f"Error saving recommendation: {e}")
        
        return insights
    except Exception as e:
        print(f"Insights Generation Error: {e}")
        raise HTTPException(status_code=500, detail="AI Analysis Link Failed")

@router.get("/history")
async def get_insight_history(x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        recs = fetch_ai_recommendations(user_id)
        return recs
    except Exception as e:
        print(f"History Fetch Error: {e}")
        return []
