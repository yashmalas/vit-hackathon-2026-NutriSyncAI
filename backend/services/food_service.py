import os
import requests
import json
import google.generativeai as genai
from typing import Dict, Any
from services.gemini_service import get_best_model, parse_json_safely

# Load Keys
USDA_API_KEY = os.environ.get("USDA_API_KEY", "ERthiJ6h58")

def get_usda_nutrition(food_name: str) -> Dict[str, Any]:
    """
    Fetches nutrition data from USDA FoodData Central.
    """
    url = f"https://api.nal.usda.gov/fdc/v1/foods/search?query={food_name}&pageSize=1&api_key={USDA_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        if data.get("foods"):
            food = data["foods"][0]
            nutrients = {n["nutrientName"]: n["value"] for n in food.get("foodNutrients", [])}
            return {
                "calories": nutrients.get("Energy", nutrients.get("Energy (kcal)", 0)),
                "protein": nutrients.get("Protein", 0),
                "carbs": nutrients.get("Carbohydrate, by difference", 0),
                "fat": nutrients.get("Total lipid (fat)", 0)
            }
    except Exception as e:
        print(f"USDA API Sync Error: {e}")
    return {}

def analyze_food_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Analyzes food image using Gemini Vision and verifies/enhances with USDA data.
    """
    try:
        model = get_best_model() 
        
        image_parts = [{"mime_type": "image/jpeg", "data": image_bytes}]
        
        prompt = """
        ACT AS: Nutritional Bio-Scanner.
        TASK: Analyze biological sample (food image).
        FORMAT: Return ONLY valid JSON.
        JSON STRUCTURE:
        {
          "food_name": "string",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "confidence": number (float 0-1)
        }
        """
        
        response = model.generate_content([prompt, image_parts[0]])
        ai_data = parse_json_safely(response.text)
        
        # Verify with USDA for higher accuracy nutrients
        usda_data = get_usda_nutrition(ai_data["food_name"])
        
        final_nutrition = {
            "calories": usda_data.get("calories") or ai_data.get("calories", 0),
            "protein": usda_data.get("protein") or ai_data.get("protein", 0),
            "carbs": usda_data.get("carbs") or ai_data.get("carbs", 0),
            "fat": usda_data.get("fat") or ai_data.get("fat", 0)
        }
        
        return {
            "food_name": ai_data.get("food_name", "Unknown Biotic Matter"),
            "confidence": ai_data.get("confidence", 0.5),
            "nutrition": final_nutrition
        }

    except Exception as e:
        print(f"Neural Scanner Variance: {e}")
        return {
            "food_name": "Sample Decoding Error",
            "confidence": 0,
            "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0},
            "error": str(e)
        }
