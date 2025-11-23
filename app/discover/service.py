from app.db.mongo import get_database
from typing import Optional

class DiscoverService:
    async def search_creators(self, 
                            genre: Optional[str] = None, 
                            region: Optional[str] = None,
                            search: Optional[str] = None,
                            min_subs: Optional[int] = None,
                            skip: int = 0,
                            limit: int = 20):
        db = await get_database()
        
        query = {}
        
        # Add filters
        if genre:
            query["primary_genre"] = {"$regex": genre, "$options": "i"}
        if region:
            query["region"] = {"$regex": region, "$options": "i"}
        
        # Add text search
        if search:
            query["$or"] = [
                {"display_name": {"$regex": search, "$options": "i"}},
                {"bio": {"$regex": search, "$options": "i"}},
                {"primary_genre": {"$regex": search, "$options": "i"}}
            ]
        
        creators = await db.creators.find(query).skip(skip).limit(limit).to_list(length=limit)
        return creators

    async def search_brands(self):
        db = await get_database()
        return await db.brands.find().to_list(length=50)
