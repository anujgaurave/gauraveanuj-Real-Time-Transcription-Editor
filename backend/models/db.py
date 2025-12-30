import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("❌ MONGO_URI not set")

client = MongoClient(MONGO_URI)

db = client["transcription_app"]

transcript_collection = db["transcripts"]
