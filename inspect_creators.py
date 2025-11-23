import asyncio
from app.db.mongo import db
from app.config.settings import settings

async def inspect_creators():
    print("Connecting to DB...")
    db.connect()
    database = db.db
    
    cursor = database.creators.find({})
    creators = await cursor.to_list(length=100)
    
    print(f"Found {len(creators)} creators.")
    for c in creators:
        print(f"ID: {c.get('_id')}")
        print(f"  Name: {c.get('display_name')}")
        print(f"  Total Views: {c.get('total_views')}")
        print(f"  Ad Revenue: {c.get('ad_revenue')}")
        print("-" * 20)

    db.close()

if __name__ == "__main__":
    asyncio.run(inspect_creators())
