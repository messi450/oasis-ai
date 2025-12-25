from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.schemas.ai import AnalyzePromptRequest, AnalyzePromptResponse, ChatRequest, ChatResponse
from app.services.ai_service import AIService
from app.repositories.ai_logs_repo import AILogsRepository
import time

router = APIRouter()


@router.post("/analyze-prompt", response_model=AnalyzePromptResponse)
async def analyze_prompt(
    request: AnalyzePromptRequest,
    db: Session = Depends(get_db)
):
    """
    Analyze a user prompt and recommend the best AI model.
    
    This endpoint:
    1. Analyzes the prompt using keyword matching
    2. Returns a model recommendation with reasoning
    3. Logs the request for analytics
    """
    
    start_time = time.time()
    
    # Get recommendation from AI service
    result = AIService.analyze_prompt(request.prompt)
    recommendation = result['recommendation']
    alternative = result['alternative']
    
    # Calculate response time
    response_time_ms = (time.time() - start_time) * 1000
    
    # Log the request
    ai_request = AILogsRepository.create(
        db=db,
        prompt=request.prompt,
        recommended_model=recommendation.name,
        provider=recommendation.provider,
        reasoning=recommendation.reasoning,
        user_id=request.user_id,
        client_id=request.client_id,
        response_time_ms=response_time_ms,
        estimated_cost=recommendation.input_price
    )
    
    return AnalyzePromptResponse(
        recommendation=recommendation,
        alternative=alternative,
        request_id=ai_request.id
    )

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with a specific AI model.
    """
    response_text = AIService.chat_with_model(
        message=request.message,
        model_name=request.model_name,
        history=request.history
    )
    
    # Log usage (simplified for now)
    # real impl would track tokens, etc.
    
    return ChatResponse(response=response_text)

@router.get("/usage")
async def get_usage_stats(
    skip: int = 0,
    limit: int = 100,
    client_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get AI usage statistics and logs.
    """
    logs = AILogsRepository.list(db=db, skip=skip, limit=limit, client_id=client_id)
    return logs
