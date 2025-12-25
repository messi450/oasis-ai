from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.config.logging import logger
from app.api.v1.router import api_router
from app.models.base import Base, engine
from app.models import user, ai_request, feedback  # Import to register models

from sqlalchemy import text
# Create database tables
Base.metadata.create_all(bind=engine)

# Simple migration for client_id column
try:
    with engine.connect() as conn:
        # Check if client_id exists
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='ai_requests' AND column_name='client_id'"))
        if not result.fetchone():
            logger.info("Adding client_id column to ai_requests table...")
            conn.execute(text("ALTER TABLE ai_requests ADD COLUMN client_id VARCHAR"))
            conn.commit()
            logger.info("Column added successfully.")
except Exception as e:
    logger.error(f"Migration error: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# CORS middleware
origins = settings.CORS_ORIGINS.split(",")
if settings.ENVIRONMENT != "development":
    origins.append("*")  # Allow all origins in production for easier deployment

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down application")


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }
