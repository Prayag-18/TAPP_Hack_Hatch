from app.db.mongo import get_database
from app.compatibility.models import CompatibilityScore
import uuid
from datetime import datetime
import random

class CompatibilityService:
    async def calculate_score(self, creator_id: str, target_id: str, target_type: str):
        # Mock calculation logic
        score = round(random.uniform(0.5, 1.0), 2)
        breakdown = {
            "genre_match": random.randint(50, 100),
            "audience_overlap": random.randint(50, 100),
            "budget_fit": random.randint(50, 100)
        }
        
        db = await get_database()
        data = {
            "_id": str(uuid.uuid4()),
            "creator_id": creator_id,
            "target_id": target_id,
            "target_type": target_type,
            "score": score,
            "breakdown": breakdown,
            "calculated_at": datetime.utcnow()
        }
        
        await db.compatibility.insert_one(data)
        return data

    async def get_score(self, creator_id: str):
        db = await get_database()
        return await db.compatibility.find_one({"creator_id": creator_id})
