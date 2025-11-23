from app.db.mongo import get_database
from app.creators.models import CreatorUpdate
from fastapi import HTTPException
import uuid
import random
from datetime import datetime

class CreatorService:
    def generate_mock_analytics(self) -> dict:
        """Generate realistic analytics for creators"""
        subscribers = random.randint(1000, 500000)
        total_videos = random.randint(10, 500)
        total_views = subscribers * random.randint(50, 200)
        
        return {
            "subscribers": subscribers,
            "total_videos": total_videos,
            "total_views": total_views,
            "avg_views_per_video": round(total_views / total_videos, 2),
            "engagement_rate": round(random.uniform(2.5, 8.5), 2),
            "subscriber_growth_rate": round(random.uniform(-5, 25), 2),
            "posting_frequency": round(random.uniform(0.5, 7), 1),
            "top_performing_genre": random.choice(["Tutorial", "Vlog", "Review", "Gaming", "Entertainment"]),
            "audience_demographics": {
                "age_groups": {
                    "13-17": random.randint(5, 20),
                    "18-24": random.randint(25, 45),
                    "25-34": random.randint(20, 35),
                    "35-44": random.randint(10, 20),
                    "45+": random.randint(5, 15)
                },
                "gender": {
                    "male": random.randint(40, 70),
                    "female": random.randint(30, 60)
                },
                "top_countries": random.sample(["India", "USA", "UK", "Canada", "Australia", "Germany", "France"], k=random.randint(3, 5))
            },
            "performance_trend": random.choice(["growing", "growing", "stable", "declining"]),
            "last_analytics_update": datetime.utcnow().isoformat()
        }
    
    async def get_creator(self, creator_id: str):
        db = await get_database()
        creator = await db.creators.find_one({"_id": creator_id})
        if not creator:
            raise HTTPException(status_code=404, detail="Creator not found")
        
        # Generate analytics if missing
        if not creator.get("total_videos"):
            analytics = self.generate_mock_analytics()
            await db.creators.update_one(
                {"_id": creator_id},
                {"$set": analytics}
            )
            creator.update(analytics)
        
        return creator

    async def get_creator_by_user_id(self, user_id: str):
        db = await get_database()
        creator = await db.creators.find_one({"user_id": user_id})
        
        # Generate analytics if creator exists but has no analytics
        if creator and not creator.get("total_videos"):
            analytics = self.generate_mock_analytics()
            await db.creators.update_one(
                {"_id": creator["_id"]},
                {"$set": analytics}
            )
            creator.update(analytics)
        
        return creator

    async def create_profile(self, user_id: str, data: dict):
        db = await get_database()
        data["_id"] = str(uuid.uuid4())
        data["user_id"] = user_id
        
        # Add analytics for new creators
        analytics = self.generate_mock_analytics()
        data.update(analytics)
        
        await db.creators.insert_one(data)
        return data

    async def update_profile(self, user_id: str, update_data: CreatorUpdate):
        db = await get_database()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        result = await db.creators.update_one(
            {"user_id": user_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return await self.create_profile(user_id, update_dict)
            
        return await self.get_creator_by_user_id(user_id)
    
    async def get_creator_analytics(self, creator_id: str):
        """Get detailed analytics for a creator"""
        creator = await self.get_creator(creator_id)
        
        return {
            "overview": {
                "subscribers": creator.get("subscribers", 0),
                "total_videos": creator.get("total_videos", 0),
                "total_views": creator.get("total_views", 0),
                "avg_views_per_video": creator.get("avg_views_per_video", 0)
            },
            "engagement": {
                "engagement_rate": creator.get("engagement_rate", 0),
                "posting_frequency": creator.get("posting_frequency", 0),
                "subscriber_growth_rate": creator.get("subscriber_growth_rate", 0)
            },
            "performance": {
                "trend": creator.get("performance_trend", "stable"),
                "top_performing_genre": creator.get("top_performing_genre", "")
            },
            "audience": creator.get("audience_demographics", {}),
            "last_updated": creator.get("last_analytics_update")
        }
