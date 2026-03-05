import os
import requests
import json
import google.generativeai as genai
from typing import Dict, Any, List

# Load Keys
USDA_API_KEY = os.environ.get("USDA_API_KEY", "ERthiJ6h58")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def get_best_model():
    """Returns the best available Gemini model."""
    try:
        return genai.GenerativeModel("models/gemini-2.0-flash")
    except Exception as e:
        print(f"DEBUG: Model Init Error: {e}")
        return genai.GenerativeModel("models/gemini-2.0-flash")

def parse_json_safely(text: str) -> Dict[str, Any]:
    """Helper to extract JSON from model responses."""
    try:
        clean_text = text.strip()
        if "```json" in clean_text:
            clean_text = clean_text.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_text:
            clean_text = clean_text.split("```")[1].split("```")[0].strip()
        
        # Remove any leading/trailing characters that aren't { or [
        start_idx = clean_text.find('{')
        end_idx = clean_text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            clean_text = clean_text[start_idx:end_idx+1]
            
        return json.loads(clean_text)
    except Exception as e:
        print(f"JSON Parse Error: {e} | Text: {text[:100]}")
        raise e

def generate_diet_plan_logic(data: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
    ACT AS: Expert Bio-Digital Nutritionist.
    TASK: Generate a 1-day neural nutrition protocol.
    PROFILE: {json.dumps(data)}
    STRICT FORMAT: Return ONLY valid JSON.
    {{
      "daily_calories": number,
      "macros": {{ "protein": number, "carbs": number, "fat": number }},
      "meals": {{
        "Breakfast": [{{ "name": "...", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": [...], "instructions": "..." }}],
        "Lunch": [...],
        "Dinner": [...],
        "Snacks": [...]
      }},
      "advice": "High-level nutritional directive (max 20 words)."
    }}
    """
    try:
        model = get_best_model()
        response = model.generate_content(prompt)
        return parse_json_safely(response.text)
    except Exception as e:
        print(f"Plan Error: {e}")
        return {
            "daily_calories": 2100, 
            "macros": {"protein": 160, "carbs": 180, "fat": 70}, 
            "meals": {
                "Breakfast": [{"name": "Neural Protein Porridge", "calories": 450, "protein": 30, "carbs": 50, "fat": 12, "ingredients": ["Oats", "Whey", "Berries"], "instructions": "Mix and serve."}],
                "Lunch": [{"name": "Biotic Fuel Salmon Bowl", "calories": 650, "protein": 45, "carbs": 60, "fat": 25, "ingredients": ["Salmon", "Quinoa", "Avocado"], "instructions": "Grill salmon, serve with quinoa."}],
                "Dinner": [{"name": "Regen Lean Steak & Greens", "calories": 750, "protein": 55, "carbs": 40, "fat": 35, "ingredients": ["Steak", "Broccoli", "Spinach"], "instructions": "Pan-sear steak, steam greens."}],
                "Snacks": [{"name": "High-Density Almonds", "calories": 250, "protein": 10, "carbs": 15, "fat": 18, "ingredients": ["Almonds"], "instructions": "Raw consume."}]
            }, 
            "advice": "Neural link variance detected. Falling back to calibrated baseline protocol."
        }

def chat_with_nutrisync(message: str, history: List[Dict[str, Any]] = []) -> str:
    system_instruction = (
        "You are 'Sync', a NutriSync AI health assistant. Personality: friendly, clinical, biopunk vibe. "
        "Knowledgeable about health and fitness. Keep responses concise and encouraging. "
        "Use markdown for formatting."
    )
    try:
        model = get_best_model()
        clean_history = []
        for turn in (history or []):
            role = turn.get("role")
            parts = turn.get("parts", [])
            if role and parts:
                part_texts = [p.get("text", "") if isinstance(p, dict) else str(p) for p in parts]
                clean_history.append({"role": role, "parts": part_texts})

        chat = model.start_chat(history=clean_history)
        full_message = f"SYSTEM: {system_instruction}\n\nUSER: {message}" if not history else message
        response = chat.send_message(full_message)
        return response.text
    except Exception as e:
        print(f"Chat Service Error: {e}")
        try:
            model = genai.GenerativeModel("models/gemini-2.0-flash")
            response = model.generate_content(f"{system_instruction}\n\nUser: {message}")
            return response.text
        except:
            return "Neural link variance high. Systems re-routing. Please try again later."

def get_meal_alternatives(meal_name: str, target_calories: int, diet_type: str) -> list:
    prompt = f"Find 3 healthy alternatives for '{meal_name}' ({target_calories} kcal, {diet_type} diet). Return ONLY JSON list of objects with name, calories, protein, carbs, fat."
    try:
        model = get_best_model()
        response = model.generate_content(prompt)
        data = parse_json_safely(response.text)
        return data if isinstance(data, list) else data.get("alternatives", [])
    except:
        return [{"name": "Quinoa Nutrient Bowl", "calories": target_calories, "protein": 15, "carbs": 40, "fat": 10}]

def get_insights_logic(profile: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
    ACT AS: Medical AI Diagnostic Engine.
    METRICS: {json.dumps(profile)}
    PHASE: Risk Analysis.
    OUTPUT: Valid JSON.
    STRUCTURE:
    {{
      "risks": [
        {{ "label": "Metabolic Stress", "percentage": 45, "level": "Moderate" }},
        {{ "label": "Cardiovascular Strain", "percentage": 22, "level": "Low" }}
      ],
      "recommendations": [
        {{ "title": "Hydration Sync", "desc": "Increase water intake by 500ml.", "type": "success" }},
        {{ "title": "Protocol Warning", "desc": "Sugar intake exceeding safety threshold.", "type": "warning" }}
      ]
    }}
    """
    try:
        model = get_best_model()
        response = model.generate_content(prompt)
        return parse_json_safely(response.text)
    except Exception as e:
        print(f"Insights Logic Error: {e}")
        return {
            "risks": [
                {"label": "Metabolic Baseline", "percentage": 10, "level": "Low"},
                {"label": "Neural Latency", "percentage": 85, "level": "High"}
            ], 
            "recommendations": [
                {"title": "Link Variance", "desc": "Recalibrating neural insights...", "type": "warning"}
            ]
        }
