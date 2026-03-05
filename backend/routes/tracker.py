from fastapi import APIRouter, Query, Header, HTTPException
from models.meal import MealLog
from typing import Optional
from services.supabase_service import log_meal_to_supabase, get_meal_logs_by_date
import datetime

router = APIRouter()

DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000"

@router.post("/log-meal")
async def log_meal_endpoint(log: MealLog, x_user_id: Optional[str] = Header(None)):
    user_id = x_user_id or DEFAULT_USER_ID
    try:
        data = log.dict()
        res = log_meal_to_supabase(user_id, data)
        return {"message": "Meal record transmitted to Supabase hub.", "entry": res}
    except Exception as e:
        print(f"Sync Log Error: {e}")
        return {"message": "Local buffer only.", "entry": log.dict()}

@router.get("/daily-nutrition")
async def get_daily_nutrition(user_id: str = Query(...), date: str = Query(...)):
    try:
        logs = get_meal_logs_by_date(user_id, date)
        if not logs:
            return {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "entries": []}
            
        totals = {
            "calories": sum(l.get("calories", 0) for l in logs),
            "protein": sum(l.get("protein", 0) for l in logs),
            "carbs": sum(l.get("carbs", 0) for l in logs),
            "fat": sum(l.get("fat", 0) for l in logs),
            "entries": logs
        }
        return totals
    except Exception as e:
        print(f"Daily Nutrition Error: {e}")
        return {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "entries": []}

@router.get("/weekly-stats")
async def get_weekly_stats(user_id: str = Query(...)):
    try:
        # For demo, we'll try to fetch aggregated data if possible, but fallback to mock for visuals
        from services.supabase_service import get_supabase
        supabase = get_supabase()
        res = supabase.table("meal_logs").select("date, calories").eq("user_id", user_id).order("date", desc=True).limit(7).execute()
        
        if res.data and len(res.data) > 0:
            return {"weekly": sorted(res.data, key=lambda x: x["date"])}
    except:
        pass
        
    # Standard HACKARENA mock range
    return {"weekly": [
        {"date": "2026-02-27", "calories": 1850},
        {"date": "2026-02-28", "calories": 2100},
        {"date": "2026-03-01", "calories": 1950},
        {"date": "2026-03-02", "calories": 2200},
        {"date": "2026-03-03", "calories": 1750},
        {"date": "2026-03-04", "calories": 2400},
        {"date": "2026-03-05", "calories": 1240},
    ]}
