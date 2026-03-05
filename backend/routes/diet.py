from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gemini_service import generate_diet_plan_logic, get_meal_alternatives

router = APIRouter()

class DietGenerationRequest(BaseModel):
    age: int
    weight: float
    height: float
    goal: str
    activity_level: str

class MealSwapRequest(BaseModel):
    meal_name: str
    target_calories: int
    diet_type: str = "balanced"

@router.post("/generate-diet-plan")
async def generate_diet_plan_endpoint(request: DietGenerationRequest):
    """
    Generate an AI-powered personalized diet plan using Gemini 1.5 Flash.
    """
    try:
        data = {
            "age": request.age,
            "weight": request.weight,
            "height": request.height,
            "goal": request.goal,
            "activity_level": request.activity_level
        }
        plan = generate_diet_plan_logic(data)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/swap-meal")
async def swap_meal_endpoint(request: MealSwapRequest):
    """
    Get 3 AI-suggested alternatives for a specific meal.
    """
    try:
        alternatives = get_meal_alternatives(request.meal_name, request.target_calories, request.diet_type)
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
