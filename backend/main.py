from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes import auth, diet, food, tracker, risk, chat, profile, insights, wearable

app = FastAPI(title="NutriSync AI API", version="1.0.0")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from routes/ directory
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(diet.router, prefix="/api", tags=["Diet"])
app.include_router(food.router, prefix="/api/food", tags=["Food"])
app.include_router(tracker.router, prefix="/api/tracker", tags=["Tracker"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(wearable.router, prefix="/api/wearable", tags=["Wearable Data"])

@app.get("/")
def root():
    return {"message": "Neural Link Active", "status": "Stable", "version": "1.0.0"}
