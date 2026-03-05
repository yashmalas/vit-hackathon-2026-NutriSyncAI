from pydantic import BaseModel, Field
from typing import List, Optional

class UserProfile(BaseModel):
    name: str
    email: str
    age: int
    gender: str
    height: float
    weight: float
    goal: str
    activity_level: str
    diet_type: str
    allergies: List[str] = []
    budget: float
    env_mode: str
    ingredients: Optional[str] = ""

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
