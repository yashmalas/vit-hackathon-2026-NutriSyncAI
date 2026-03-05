from fastapi import APIRouter
from pydantic import BaseModel
from services.risk_service import predict_risk

router = APIRouter()

class RiskInput(BaseModel):
    bmi: float
    age: int
    activity_level: int  # 1=sedentary, 2=lightly, 3=moderate, 4=very, 5=athlete
    avg_sugar: float     # grams/day average over past week
    avg_calories: float  # daily calories average

@router.post("/predict-risk")
async def get_risk_prediction(body: RiskInput):
    """
    Runs scikit-learn ML inference to predict health risk scores for:
    - Obesity risk
    - Diabetes risk
    - Nutrient deficiency risk
    """
    result = predict_risk(
        bmi=body.bmi,
        age=body.age,
        activity_level=body.activity_level,
        avg_sugar=body.avg_sugar,
        avg_calories=body.avg_calories
    )
    return result
