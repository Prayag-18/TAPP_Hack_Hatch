from app.db.mongo import get_database
from app.brands.models import BrandUpdate
from fastapi import HTTPException
import uuid

class BrandService:
    async def get_brand(self, brand_id: str):
        db = await get_database()
        brand = await db.brands.find_one({"_id": brand_id})
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        return brand

    async def get_brand_by_user_id(self, user_id: str):
        db = await get_database()
        brand = await db.brands.find_one({"user_id": user_id})
        return brand

    async def create_profile(self, user_id: str, data: dict):
        db = await get_database()
        data["_id"] = str(uuid.uuid4())
        data["user_id"] = user_id
        await db.brands.insert_one(data)
        return data

    async def update_profile(self, user_id: str, update_data: BrandUpdate):
        db = await get_database()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        result = await db.brands.update_one(
            {"user_id": user_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return await self.create_profile(user_id, update_dict)
            
        return await self.get_brand_by_user_id(user_id)
