from pydantic import BaseModel
from typing import Optional


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str


class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
