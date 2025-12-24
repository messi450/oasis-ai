# Oasis Backend API

Production-ready FastAPI backend for AI NeuroHub.

## Features

- ✅ **AI Model Recommendations**: Analyze prompts and recommend optimal AI models
- ✅ **Request Logging**: Track all AI recommendations for analytics
- ✅ **Feedback System**: Collect user feedback to improve recommendations
- ✅ **Health Checks**: `/health` and `/ready` endpoints for monitoring
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **Database**: PostgreSQL with SQLAlchemy ORM
- ✅ **Docker**: Full containerization with docker-compose

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

The API will be available at `http://localhost:8000`

### Option 2: Local Development

```bash
# Install dependencies
pip install poetry
poetry install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if using Alembic)
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

## API Endpoints

### Health
- `GET /api/v1/health` - Health check
- `GET /api/v1/ready` - Readiness check

### AI
- `POST /api/v1/ai/analyze-prompt` - Analyze a prompt and get model recommendation

### Feedback
- `POST /api/v1/feedback/feedback` - Submit feedback for a recommendation

## Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py              # Application entrypoint
│   ├── config/              # Configuration
│   ├── api/                 # API routes
│   ├── schemas/             # Pydantic models
│   ├── services/            # Business logic
│   ├── repositories/        # Data access
│   ├── models/              # Database models
│   └── core/                # Security, utilities
├── tests/                   # Test suite
├── Dockerfile
└── docker-compose.yml
```

## Environment Variables

See `.env.example` for all available configuration options.

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app tests/
```
