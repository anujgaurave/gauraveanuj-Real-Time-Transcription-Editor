from bson import ObjectId
from datetime import datetime
from models.db import transcript_collection   # ✅ now works

def create_transcript(data):
    data["createdAt"] = datetime.utcnow()
    result = transcript_collection.insert_one(data)
    return str(result.inserted_id)

def get_transcript_by_id(transcript_id):
    try:
        doc = transcript_collection.find_one(
            {"_id": ObjectId(transcript_id)}
        )
        if not doc:
            return None

        doc["_id"] = str(doc["_id"])  
        return doc
    except Exception as e:
        print("❌ Mongo fetch error:", e)
        return None

