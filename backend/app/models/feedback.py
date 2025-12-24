from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from app.models.base import Base


class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    ai_request_id = Column(Integer, ForeignKey("ai_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    rating = Column(Integer)  # 1-5
    was_helpful = Column(Boolean)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
