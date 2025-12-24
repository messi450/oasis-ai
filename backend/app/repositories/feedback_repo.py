from sqlalchemy.orm import Session
from app.models.feedback import Feedback
from typing import Optional


class FeedbackRepository:
    """Data access layer for feedback"""
    
    @staticmethod
    def create(
        db: Session,
        ai_request_id: int,
        rating: Optional[int] = None,
        was_helpful: Optional[bool] = None,
        comment: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Feedback:
        """Create feedback for an AI recommendation"""
        
        feedback = Feedback(
            ai_request_id=ai_request_id,
            user_id=user_id,
            rating=rating,
            was_helpful=was_helpful,
            comment=comment
        )
        
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        
        return feedback
