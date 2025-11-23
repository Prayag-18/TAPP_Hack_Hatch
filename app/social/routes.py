from fastapi import APIRouter, Depends, Request
from app.auth.routes import get_current_user
from app.social.service import SocialService
from app.config.settings import settings
from typing import List
from app.social.models import SocialAccount

router = APIRouter()
service = SocialService()

@router.get("/youtube/login")
async def login_youtube():
    return {
        "url": f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={settings.YOUTUBE_CLIENT_ID}&redirect_uri={settings.YOUTUBE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline"
    }

@router.get("/youtube/callback")
async def callback_youtube(code: str, current_user: dict = Depends(get_current_user)):
    # Note: In a real flow, the callback usually happens in the browser, and the frontend sends the code to the backend.
    # Here we assume the frontend redirects or calls this endpoint with the code.
    # If this is a direct browser callback, we wouldn't have the Bearer token in headers easily.
    # For MVP API design, we assume the frontend handles the redirect and sends the code here authenticated.
    return await service.link_account(current_user["_id"], code)

@router.get("/accounts", response_model=List[SocialAccount])
async def get_accounts(current_user: dict = Depends(get_current_user)):
    # Need to find the creator profile for this user first
    # For simplicity, assuming we can look up by user_id or we store creator_id in token
    # Let's fetch creator profile first
    from app.creators.service import CreatorService
    creator_service = CreatorService()
    creator = await creator_service.get_creator_by_user_id(current_user["_id"])
    if not creator:
        return []
    return await service.get_accounts(creator["_id"])

@router.post("/sync/{account_id}")
async def sync_account(account_id: str, current_user: dict = Depends(get_current_user)):
    return await service.sync_account(account_id)
