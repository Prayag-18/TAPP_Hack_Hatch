import functools
from app.config.settings import settings

def privacy_clean(func):
    """
    Decorator to sanitize logs and inputs.
    If STRICT_PRIVACY_MODE is True, it ensures no sensitive data is logged.
    """
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        if settings.STRICT_PRIVACY_MODE:
            # In a real implementation, we would inspect args/kwargs and redact sensitive fields
            # For now, we just ensure we don't log raw inputs in our hypothetical logger
            pass
        return await func(*args, **kwargs)
    return wrapper

def sanitize_text(text: str) -> str:
    """
    Removes PII or sensitive info. 
    For MVP, this is a placeholder for a more complex regex/NLP cleaner.
    """
    if not text:
        return ""
    # Placeholder: In real app, remove emails, phone numbers, etc.
    return text
