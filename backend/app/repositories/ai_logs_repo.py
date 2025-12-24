from sqlalchemy.orm import Session
from app.models.ai_request import AIRequest
from typing import Optional


class AILogsRepository:
    """Data access layer for AI request logs"""
    
    @staticmethod
    def create(
        db: Session,
        prompt: str,
        recommended_model: str,
        provider: str,
        reasoning: str,
        user_id: Optional[int] = None,
        response_time_ms: Optional[float] = None,
        estimated_cost: Optional[float] = None
    ) -> AIRequest:
        """Log an AI recommendation request"""
        
        ai_request = AIRequest(
            user_id=user_id,
            prompt=prompt,
            recommended_model=recommended_model,
            provider=provider,
            reasoning=reasoning,
            response_time_ms=response_time_ms,
            estimated_cost=estimated_cost
        )
        
        db.add(ai_request)
        db.commit()
        db.refresh(ai_request)
        
        return ai_request
    
    @staticmethod
    def get_by_id(db: Session, request_id: int) -> Optional[AIRequest]:
        """Get an AI request by ID"""
        return db.query(AIRequest).filter(AIRequest.id == request_id).first()
