import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    # Disable reload in production
    is_dev = os.getenv("ENVIRONMENT", "development") == "development"
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=is_dev)
