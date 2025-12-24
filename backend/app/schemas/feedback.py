from pydantic import BaseModel
from typing import Optional


class FeedbackCreate(BaseModel):
    ai_request_id: int
    rating: Optional[int] = None  # 1-5
    was_helpful: Optional[bool] = None
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: int
    ai_request_id: int
    rating: Optional[int]
    was_helpful: Optional[bool]
    comment: Optional[str]
    
    class Config:
        from_attributes = True
