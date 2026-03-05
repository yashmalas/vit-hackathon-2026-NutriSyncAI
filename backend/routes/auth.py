from fastapi import APIRouter, HTTPException
from models.user import UserSignup, UserLogin, UserProfile
from services.supabase_service import update_user_metadata
from services.supabase_service import get_supabase

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):
    """
    Supabase handles auth on the frontend, but we track users in our DB.
    """
    try:
        # In a real app, this might involve calling supabase.auth.sign_up
        # For now, we update our internal users table
        name_parts = user.name.split(" ")
        update_user_metadata("dummy-id", {
            "email": user.email,
            "display_name": user.name
        })
        return {"message": "User registered protocol active.", "uid": "temp-uid", "name": user.name}
    except Exception as e:
        return {"message": "Signup sync failed", "error": str(e)}

@router.post("/login")
async def login(user: UserLogin):
    """
    Frontend should login via Supabase client and send token/id to backend.
    """
    return {"message": "Neural link verified.", "uid": "active-uid", "token": "session-active"}

@router.put("/health-profile")
async def update_health_profile_legacy(profile: UserProfile):
    """
    Legacy endpoint redirected to the new profile system.
    """
    return {"message": "Redirecting to /api/profile/update", "status": "deprecated"}
