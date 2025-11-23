from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import uuid

# ----------------------------
# MongoDB Setup
# ----------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["tapp_db"]

# Drop existing collections for clean seed
db.users.delete_many({})
db.creators.delete_many({})
db.brands.delete_many({})
db.social_accounts.delete_many({})
db.channel_snapshots.delete_many({})
db.videos.delete_many({})
db.compatibility.delete_many({})
db.projects.delete_many({})
db.investments.delete_many({})

# ----------------------------
# Helper functions
# ----------------------------
def rand_id():
    return str(uuid.uuid4())

def rand_views():
    return random.randint(10_000, 2_000_000)

def rand_engagement():
    return round(random.uniform(0.5, 10.0), 2)

def rand_revenue():
    return round(random.uniform(50, 5000), 2)


# ----------------------------
# 1. Users
# ----------------------------
users = []
for i in range(10):
    users.append({
        "_id": rand_id(),
        "email": f"user{i}@example.com",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJkqvJL7K",  # "password"
        "role": random.choice(["CREATOR", "BRAND", "FAN"]),
        "created_at": datetime.utcnow()
    })

db.users.insert_many(users)
print("[+] Inserted Users")


# ----------------------------
# 2. Creator Profiles
# ----------------------------
creators = []
for u in users:
    if u["role"] == "CREATOR":
        creators.append({
            "_id": rand_id(),
            "user_id": u["_id"],
            "display_name": f"Creator {random.randint(1, 999)}",
            "bio": "Content creator focusing on tech and lifestyle.",
            "primary_genre": random.choice(["Tech", "Gaming", "Travel", "Education"]),
            "region": random.choice(["India", "USA", "UK"]),
            "avatar_url": "https://dummyimage.com/200x200",
        })

if creators:
    db.creators.insert_many(creators)
    print("[+] Inserted Creator Profiles")


# ----------------------------
# 3. Brand Profiles
# ----------------------------
brands = []
for u in users:
    if u["role"] == "BRAND":
        brands.append({
            "_id": rand_id(),
            "user_id": u["_id"],
            "brand_name": f"Brand {random.randint(1, 999)}",
            "industry": random.choice(["Tech", "Fashion", "Food", "Travel"]),
            "region": random.choice(["India", "USA", "UK"]),
            "budget_band": random.choice(["$1k-$5k", "$5k-$10k", "$10k+"]),
        })

if brands:
    db.brands.insert_many(brands)
    print("[+] Inserted Brand Profiles")


# ----------------------------
# 4. Social Accounts
# ----------------------------
social_accounts = []
for c in creators:
    social_accounts.append({
        "_id": rand_id(),
        "creator_id": c["_id"],
        "platform": "YOUTUBE",
        "external_channel_id": f"YT-{rand_id()}",
        "access_token": "encrypted_access_token",
        "refresh_token": "encrypted_refresh_token",
        "last_synced_at": datetime.utcnow()
    })

if social_accounts:
    db.social_accounts.insert_many(social_accounts)
    print("[+] Inserted Social Accounts")


# ----------------------------
# 5. Channel Snapshots
# ----------------------------
channel_snapshots = []
for acc in social_accounts:
    channel_snapshots.append({
        "_id": rand_id(),
        "social_account_id": acc["_id"],
        "date": datetime.utcnow(),
        "subscribers": random.randint(1_000, 500_000),
        "views": rand_views(),
        "watch_time": random.randint(10_000, 200_000),
        "estimated_revenue": rand_revenue(),
        "engagement_rate": rand_engagement(),
    })

if channel_snapshots:
    db.channel_snapshots.insert_many(channel_snapshots)
    print("[+] Inserted Channel Snapshots")


# ----------------------------
# 6. Videos
# ----------------------------
videos = []
for acc in social_accounts:
    for _ in range(5):  # 5 videos per creator
        videos.append({
            "_id": rand_id(),
            "social_account_id": acc["_id"],
            "external_video_id": f"VID-{rand_id()}",
            "title": random.choice([
                "My Day in Delhi", "Tech Review 2025", "Travel Vlog: Japan",
                "AI Tools You Should Use", "How to grow fast on YouTube"
            ]),
            "published_at": datetime.utcnow() - timedelta(days=random.randint(1, 200)),
            "views": rand_views(),
            "likes": random.randint(100, 50_000),
            "comments_count": random.randint(10, 5000),
            "shares": random.randint(10, 2000),
        })

if videos:
    db.videos.insert_many(videos)
    print("[+] Inserted Videos")


# ----------------------------
# 7. Compatibility Scores
# ----------------------------
compat_list = []
for c in creators:
    for brand in brands:
        compat_list.append({
            "_id": rand_id(),
            "creator_id": c["_id"],
            "target_id": brand["user_id"],
            "target_type": "BRAND",
            "score": round(random.uniform(0.1, 1.0), 2),
            "breakdown": {
                "genre_match": random.randint(0, 100),
                "audience_overlap": random.randint(0, 100),
                "budget_fit": random.randint(0, 100)
            },
            "calculated_at": datetime.utcnow()
        })

if compat_list:
    db.compatibility.insert_many(compat_list)
    print("[+] Inserted Compatibility Scores")


# ----------------------------
# 8. Crowdfunding Projects
# ----------------------------
projects = []
for c in creators:
    projects.append({
        "_id": rand_id(),
        "creator_id": c["user_id"],
        "title": "New Documentary Series",
        "description": "An in-depth exploration of creator life.",
        "goal_amount": 5000,
        "min_investment": 10,
        "status": "LIVE",
        "projected_roi": random.randint(5, 20),
        "created_at": datetime.utcnow(),
    })

if projects:
    db.projects.insert_many(projects)
    print("[+] Inserted Projects")


# ----------------------------
# 9. Investments
# ----------------------------
investments = []
fans = [u for u in users if u["role"] == "FAN"]
if fans and projects:
    for p in projects:
        for _ in range(random.randint(1, 3)):  # random fans invest
            fan = random.choice(fans)
            investments.append({
                "_id": rand_id(),
                "project_id": p["_id"],
                "investor_id": fan["_id"],
                "amount": random.randint(10, 200),
                "status": "SUCCESS",
                "created_at": datetime.utcnow()
            })

if investments:
    db.investments.insert_many(investments)
    print("[+] Inserted Investments")

print("\n-----------------------------")
print("🎉 Dummy data successfully seeded into MongoDB!")
print("-----------------------------")
