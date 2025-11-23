from app.db.mongo import get_database
from fastapi import HTTPException

class AnalyticsService:
    async def get_creator_analytics(self, creator_id: str):
        db = await get_database()
        # Get all social accounts for creator
        accounts = await db.social_accounts.find({"creator_id": creator_id}).to_list(length=100)
        account_ids = [acc["_id"] for acc in accounts]
        
        # Aggregate snapshots
        pipeline = [
            {"$match": {"social_account_id": {"$in": account_ids}}},
            {"$sort": {"date": -1}},
            {"$limit": 30} # Last 30 snapshots
        ]
        snapshots = await db.channel_snapshots.aggregate(pipeline).to_list(length=30)
        return snapshots

    async def get_video_analytics(self, video_id: str):
        db = await get_database()
        video = await db.videos.find_one({"_id": video_id})
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        return video
