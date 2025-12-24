import logging
import sys
from contextvars import ContextVar
from typing import Optional

# Request ID context
request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


class RequestIdFilter(logging.Filter):
    """Add request ID to log records"""
    
    def filter(self, record):
        record.request_id = request_id_var.get() or "no-request-id"
        return True


def setup_logging():
    """Configure structured logging"""
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Add request ID filter to root logger
    for handler in logging.root.handlers:
        handler.addFilter(RequestIdFilter())
    
    return logging.getLogger(__name__)


logger = setup_logging()
