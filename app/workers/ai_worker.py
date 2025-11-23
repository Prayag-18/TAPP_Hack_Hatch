import asyncio
from app.db.mongo import MongoDB, settings
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import requests

# We need a synchronous wrapper or a way to run async code in RQ
# RQ is synchronous by default. We can use asyncio.run()

async def async_process_job(job_id: str):
    # Connect to DB independently as this is a separate process
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DB_NAME]
    
    print(f"Processing job {job_id}")
    
    job = await db.ai_jobs.find_one({"_id": job_id})
    if not job:
        print("Job not found")
        return

    await db.ai_jobs.update_one({"_id": job_id}, {"$set": {"status": "PROCESSING"}})

    try:
        # 1. Fetch comments (Mock)
        # In real app, fetch from db.comments or YouTube API
        comments = ["Great video!", "I love this content.", "Please make more tutorials."]
        
        # 2. Call GPU Worker (Mock)
        # response = requests.post("http://gpu-worker/run", json={"model": "sentiment", "input": comments})
        # result = response.json()
        
        # Mock result
        result = {
            "sentiment": {"positive": 80, "neutral": 15, "negative": 5},
            "themes": ["praise", "request"],
            "summary": "Viewers are very happy with the content."
        }
        
        # 3. Save result
        await db.ai_jobs.update_one(
            {"_id": job_id}, 
            {
                "$set": {
                    "status": "COMPLETED",
                    "result": result,
                    "completed_at": datetime.utcnow()
                }
            }
        )
        print(f"Job {job_id} completed")
        
    except Exception as e:
        print(f"Job failed: {e}")
        await db.ai_jobs.update_one({"_id": job_id}, {"$set": {"status": "FAILED"}})
    finally:
        client.close()

def process_ai_job(job_id: str):
    asyncio.run(async_process_job(job_id))
