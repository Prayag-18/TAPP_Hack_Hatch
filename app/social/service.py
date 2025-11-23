from app.db.mongo import get_database
from app.config.settings import settings
from fastapi import HTTPException
import uuid
from datetime import datetime
import httpx

class SocialService:
    async def get_accounts(self, creator_id: str):
        db = await get_database()
        cursor = db.social_accounts.find({"creator_id": creator_id})
        return await cursor.to_list(length=100)

    async def link_account(self, creator_id: str, code: str):
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.YOUTUBE_CLIENT_ID,
                    "client_secret": settings.YOUTUBE_CLIENT_SECRET,
                    "redirect_uri": settings.YOUTUBE_REDIRECT_URI,
                    "grant_type": "authorization_code"
                }
            )
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to retrieve token from Google")
            
            token_data = response.json()
            
            # Get channel info
            # In a real app, we would use the access token to fetch channel details
            # For MVP, we'll mock the channel ID or assume it comes from a userinfo endpoint
            external_channel_id = "mock_channel_id_" + str(uuid.uuid4())[:8] 
            
            db = await get_database()
            account = {
                "_id": str(uuid.uuid4()),
                "creator_id": creator_id,
                "platform": "YOUTUBE",
                "external_channel_id": external_channel_id,
                "access_token": token_data.get("access_token"),
                "refresh_token": token_data.get("refresh_token"),
                "last_synced_at": datetime.utcnow()
            }
            
            await db.social_accounts.insert_one(account)
            return account

    async def sync_account(self, account_id: str):
        # Mock sync logic
        db = await get_database()
        await db.social_accounts.update_one(
            {"_id": account_id},
            {"$set": {"last_synced_at": datetime.utcnow()}}
        )
        return {"status": "synced"}
