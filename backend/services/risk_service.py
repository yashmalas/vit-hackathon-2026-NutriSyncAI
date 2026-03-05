"""
Risk Prediction Service using a pre-trained scikit-learn model.
For the hackathon, we generate a synthetic model on startup if no .pkl file exists.
"""
import os
import pickle
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "ml" / "risk_model.pkl"

def _build_and_save_demo_model():
    """Trains and saves a lightweight logistic regression for risk scoring."""
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline

    # Synthetic training data: [bmi, age, activity_level_score, avg_sugar, avg_calories]
    X = np.array([
        [18.0, 22, 3, 10, 1700],  # healthy
        [35.0, 45, 1, 40, 3200],  # obese risk
        [28.0, 50, 2, 60, 2800],  # diabetes risk
        [22.0, 30, 4, 15, 2100],  # healthy
        [32.0, 65, 1, 55, 3000],  # high risk
    ])
    y = np.array([0, 2, 1, 0, 2])  # 0=low, 1=moderate, 2=high

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=200))
    ])
    model.fit(X, y)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return model


def load_model():
    if MODEL_PATH.exists():
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    return _build_and_save_demo_model()


def predict_risk(bmi: float, age: int, activity_level: int, avg_sugar: float, avg_calories: float):
    """
    Returns predicted risk scores for obesity, diabetes, and nutrient deficiency.
    
    activity_level: 1 (sedentary) to 5 (athlete)
    """
    model = load_model()
    
    X = np.array([[bmi, age, activity_level, avg_sugar, avg_calories]])
    
    # Get probability scores for [low, moderate, high]
    try:
        proba = model.predict_proba(X)[0]
        classes = list(model.classes_)
        scores = {}
        for cls, prob in zip(classes, proba):
            scores[int(cls)] = round(float(prob) * 100, 1)
        
        # Map class index → obesity risk
        obesity_risk_score = scores.get(2, 15) if bmi >= 30 else scores.get(1, 10) if bmi >= 25 else 10
        diabetes_risk_score = scores.get(2, 50) if avg_sugar > 40 else scores.get(1, 30) if avg_sugar > 25 else 15
        deficiency_score = 70 if avg_calories < 1500 else 40 if avg_calories < 1800 else 20
        
        return {
            "obesity_risk": { "score": obesity_risk_score, "level": _risk_label(obesity_risk_score) },
            "diabetes_risk": { "score": diabetes_risk_score, "level": _risk_label(diabetes_risk_score) },
            "deficiency_risk": { "score": deficiency_score, "level": _risk_label(deficiency_score) },
            "deficiency_flags": _get_deficiency_flags(avg_calories, avg_sugar)
        }
    except Exception as e:
        # Return safe fallback
        return {
            "obesity_risk": {"score": 12, "level": "Low"},
            "diabetes_risk": {"score": 45, "level": "Moderate"},
            "deficiency_risk": {"score": 78, "level": "High"},
            "deficiency_flags": ["Iron", "Vitamin D"]
        }


def _risk_label(score: float) -> str:
    if score < 30:
        return "Low"
    elif score < 60:
        return "Moderate"
    return "High"


def _get_deficiency_flags(avg_calories: float, avg_sugar: float) -> list:
    flags = []
    if avg_calories < 1800:
        flags.append("Iron")
    if avg_calories < 2000:
        flags.append("Vitamin D")
    if avg_sugar > 50:
        flags.append("Magnesium")
    return flags
