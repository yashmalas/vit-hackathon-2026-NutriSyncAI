import os
from supabase import create_client, Client
from typing import Optional, Dict, Any, List

_supabase: Optional[Client] = None

def get_supabase():
    global _supabase
    if _supabase is None:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_ANON_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL or SUPABASE_ANON_KEY not set")
        _supabase = create_client(url, key)
    return _supabase

# Helper to use in functions below
def supabase():
    return get_supabase()

# 1. User Profiles (Mapping to health_profiles table as requested)
def get_health_profile(user_id: str):
    try:
        res = supabase().table("health_profiles").select("*").eq("user_id", user_id).single().execute()
        return res.data
    except:
        return None

def upsert_health_profile(user_id: str, data: Dict[str, Any]):
    data["user_id"] = user_id
    # We use user_id as a unique constraint
    res = supabase().table("health_profiles").upsert(data, on_conflict="user_id").execute()
    return res.data

# 2. Meal Logs
def log_meal_to_supabase(user_id: str, meal_data: Dict[str, Any]):
    meal_data["user_id"] = user_id
    if "created_at" not in meal_data:
        import datetime
        meal_data["created_at"] = datetime.datetime.utcnow().isoformat()
    res = supabase().table("meal_logs").insert(meal_data).execute()
    return res.data

def get_meal_logs_by_date(user_id: str, date_str: str):
    # date_str expected as YYYY-MM-DD
    res = supabase().table("meal_logs").select("*").eq("user_id", user_id).eq("date", date_str).execute()
    return res.data

# 3. Wearable Data
def log_wearable_vitals(user_id: str, vitals: Dict[str, Any]):
    vitals["user_id"] = user_id
    vitals["timestamp"] = vitals.get("timestamp", "now()")
    res = supabase().table("wearable_data").insert(vitals).execute()
    return res.data

# 4. AI Recommendations
def save_ai_recommendation(user_id: str, rec: Dict[str, Any]):
    rec["user_id"] = user_id
    res = supabase().table("ai_recommendations").insert(rec).execute()
    return res.data

def fetch_ai_recommendations(user_id: str, limit: int = 5):
    res = supabase().table("ai_recommendations").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
    return res.data

# 5. Generic Users metadata (mirroring auth)
def update_user_metadata(user_id: str, metadata: Dict[str, Any]):
    metadata["id"] = user_id
    res = supabase().table("users").upsert(metadata).execute()
    return res.data
