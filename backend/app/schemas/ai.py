from pydantic import BaseModel
from typing import List, Optional

class AnalyzePromptRequest(BaseModel):
    prompt: str
    user_id: Optional[int] = None

class ChatRequest(BaseModel):
    message: str
    model_name: str
    history: Optional[List[dict]] = []
    user_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    request_id: Optional[int] = None

class ModelRecommendation(BaseModel):
    name: str
    provider: str
    reasoning: str
    input_price: float
    output_price: float
    speed: str
    categories: List[str]

class AnalyzePromptResponse(BaseModel):
    recommendation: ModelRecommendation
    request_id: int
