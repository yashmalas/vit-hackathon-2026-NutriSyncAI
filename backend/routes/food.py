from fastapi import APIRouter, HTTPException, UploadFile, File
from services.food_service import analyze_food_image
import base64

router = APIRouter()

@router.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...)):
    """
    Identifies food from an uploaded image using Gemini Vision + USDA.
    """
    try:
        contents = await file.read()
        result = analyze_food_image(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-food-url")
async def analyze_food_url(image_data: dict):
    """
    Handle base64 image data strings.
    """
    try:
        # Expecting { "image": "base64_string" }
        b64_str = image_data.get("image", "").split(",")[-1]
        contents = base64.b64decode(b64_str)
        result = analyze_food_image(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
