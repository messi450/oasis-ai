from sqlalchemy.orm import Session
from app.models.ai_request import AIRequest
from typing import Optional, List


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
        client_id: Optional[str] = None,
        response_time_ms: Optional[float] = None,
        estimated_cost: Optional[float] = None
    ) -> AIRequest:
        """Log an AI recommendation request"""
        
        ai_request = AIRequest(
            user_id=user_id,
            client_id=client_id,
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
    def list(db: Session, skip: int = 0, limit: int = 100, client_id: Optional[str] = None) -> List[AIRequest]:
        """List AI requests with pagination"""
        query = db.query(AIRequest)
        if client_id:
            query = query.filter(AIRequest.client_id == client_id)
        return query.order_by(AIRequest.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, request_id: int) -> Optional[AIRequest]:
        """Get a specific AI request log by ID"""
        return db.query(AIRequest).filter(AIRequest.id == request_id).first()

    @staticmethod
    def get_stats(db: Session):
        """Get summary stats for dashboard"""
        # This is a simple implementation, could be optimized with raw SQL or complex queries
        requests = db.query(AIRequest).all()
        return requests
