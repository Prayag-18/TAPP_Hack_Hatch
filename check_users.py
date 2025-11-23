from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['tapp_db']
users = list(db.users.find())
print(f'Total users: {len(users)}')
for u in users[:5]:
    print(f'User: {u["email"]}, ID: {u["_id"]}, Type: {type(u["_id"]).__name__}')
