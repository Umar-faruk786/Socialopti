import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.utils.db_seeder import init_db
from app.utils.file_storage import ensure_upload_dir
from app.middleware.error_handler import global_exception_handler
from app.routes import (
    auth_router,
    profile_router,
    content_router,
    analysis_router,
    recommendations_router,
    prediction_router,
    analytics_router,
    history_router,
    trends_router,
    calendar_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure upload directory exists, initialize DB tables & seed initial data
    ensure_upload_dir()
    init_db()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="SocialOpti AI Framework API",
    description="Intelligent Multi-Agent AI Framework for Social Media Content Optimization and Engagement Prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Vite frontend dev & preview servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded media static directory
upload_dir = ensure_upload_dir()
app.mount("/static/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Register All API Routers under /api
api_prefix = settings.API_PREFIX

app.include_router(auth_router, prefix=api_prefix)
app.include_router(profile_router, prefix=api_prefix)
app.include_router(content_router, prefix=api_prefix)
app.include_router(analysis_router, prefix=api_prefix)
app.include_router(recommendations_router, prefix=api_prefix)
app.include_router(prediction_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)
app.include_router(history_router, prefix=api_prefix)
app.include_router(trends_router, prefix=api_prefix)
app.include_router(calendar_router, prefix=api_prefix)

# Catch-all exception handler
app.add_exception_handler(Exception, global_exception_handler)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "api_prefix": settings.API_PREFIX
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
