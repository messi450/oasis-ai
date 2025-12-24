from fastapi import APIRouter
from app.api.v1 import health, ai, feedback

api_router = APIRouter()

# Include all v1 routes
api_router.include_router(health.router, tags=["health"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
