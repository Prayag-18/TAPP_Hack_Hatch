from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['tapp_db']

projects = list(db.projects.find())
print(f'Total projects in DB: {len(projects)}')

for p in projects[:10]:
    print(f'\nProject: {p.get("title", "No title")}')
    print(f'  ID: {p["_id"]}')
    print(f'  Creator: {p.get("creator_id", "No creator")}')
    print(f'  Status: {p.get("status", "No status")}')
    print(f'  Goal: ${p.get("goal_amount", 0)}')
