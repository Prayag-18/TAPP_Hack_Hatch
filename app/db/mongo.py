from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.DB_NAME]
        print(f"Connected to MongoDB at {settings.MONGODB_URL}")

    def close(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

db = MongoDB()

async def get_database():
    return db.db
