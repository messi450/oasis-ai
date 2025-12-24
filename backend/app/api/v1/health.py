from fastapi import APIRouter
from app.schemas.common import HealthResponse
from app.config.settings import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT
    )


@router.get("/ready", response_model=HealthResponse)
async def readiness_check():
    """Readiness check for Kubernetes/Docker"""
    # TODO: Add database connectivity check
    return HealthResponse(
        status="ready",
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT
    )
