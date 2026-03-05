from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MealItem(BaseModel):
    name: str
    calories: int
    protein: int
    carbs: int
    fat: int
    ingredients: List[str]
    instructions: Optional[str] = None

class DietPlanResponse(BaseModel):
    daily_calories: int
    meals: Dict[str, List[MealItem]]
    hydration_goal: str
    notes: Optional[str] = None
