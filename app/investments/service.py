from app.db.mongo import get_database
from app.investments.models import InvestmentCreate
import uuid
from datetime import datetime

class InvestmentService:
    async def invest(self, user_id: str, project_id: str, investment: InvestmentCreate):
        db = await get_database()
        data = {
            "_id": str(uuid.uuid4()),
            "project_id": project_id,
            "investor_id": user_id,
            "amount": investment.amount,
            "status": "SUCCESS",
            "created_at": datetime.utcnow()
        }
        await db.investments.insert_one(data)
        return data

    async def get_my_investments(self, user_id: str):
        db = await get_database()
        return await db.investments.find({"investor_id": user_id}).to_list(length=100)
