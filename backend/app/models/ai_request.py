from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.sql import func
from app.models.base import Base


class AIRequest(Base):
    __tablename__ = "ai_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    prompt = Column(Text, nullable=False)
    recommended_model = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    reasoning = Column(Text)
    response_time_ms = Column(Float)
    estimated_cost = Column(Float)
    request_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
