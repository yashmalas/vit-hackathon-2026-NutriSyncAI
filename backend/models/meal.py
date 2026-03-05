from pydantic import BaseModel
from typing import Optional

class MealLog(BaseModel):
    user_id: str
    date: str  # format: YYYY-MM-DD
    meal_type: str  # Breakfast, Lunch, Dinner, Snack
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
