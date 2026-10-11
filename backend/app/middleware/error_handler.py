import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger("socialopti")

async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all unhandled exception middleware handler."""
    logger.error(f"Global Exception on {request.method} {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later.", "error": str(exc)}
    )
