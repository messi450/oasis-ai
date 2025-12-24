from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.repositories.feedback_repo import FeedbackRepository
from app.repositories.ai_logs_repo import AILogsRepository

router = APIRouter()


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db)
):
    """
    Submit feedback for an AI recommendation.
    
    This helps improve future recommendations through user feedback.
    """
    
    # Verify the AI request exists
    ai_request = AILogsRepository.get_by_id(db, feedback.ai_request_id)
    if not ai_request:
        raise HTTPException(status_code=404, detail="AI request not found")
    
    # Create feedback
    created_feedback = FeedbackRepository.create(
        db=db,
        ai_request_id=feedback.ai_request_id,
        rating=feedback.rating,
        was_helpful=feedback.was_helpful,
        comment=feedback.comment
    )
    
    return created_feedback
