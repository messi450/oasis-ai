from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title=os.getenv("APP_NAME", "Oasis Backend"))

# CORS
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from typing import List, Optional

class AnalyzePromptRequest(BaseModel):
    prompt: str
    user_id: Optional[int] = None

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

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/api/v1/ai/analyze-prompt", response_model=AnalyzePromptResponse)
async def analyze_prompt(request: AnalyzePromptRequest):
    prompt_lower = request.prompt.lower()
    
    # Simple logic (same as before)
    if any(word in prompt_lower for word in ["code", "debug", "programming"]):
        rec = ModelRecommendation(
            name="OpenAI o3", provider="OpenAI",
            reasoning="Top performer on coding leaderboards.",
            input_price=2.0, output_price=8.0, speed="Fast", categories=["Code"]
        )
    elif any(word in prompt_lower for word in ["write", "blog", "content"]):
        rec = ModelRecommendation(
            name="Claude 3.5 Sonnet", provider="Anthropic",
            reasoning="Exceptional writing quality.",
            input_price=3.0, output_price=15.0, speed="Fast", categories=["Writing"]
        )
    else:
        rec = ModelRecommendation(
            name="GPT-4o", provider="OpenAI",
            reasoning="The most versatile AI model.",
            input_price=2.5, output_price=10.0, speed="Fast", categories=["Auto"]
        )
    
    return AnalyzePromptResponse(recommendation=rec, request_id=123)

@app.post("/api/v1/feedback/feedback")
async def feedback(data: dict):
    return {"status": "success"}
