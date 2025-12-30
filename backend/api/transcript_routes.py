from flask import Blueprint, jsonify
from models.transcript_model import get_transcript_by_id

transcript_api = Blueprint("transcript_api", __name__)

@transcript_api.route("/api/transcript/<session_id>", methods=["GET"])
def get_transcript(session_id):
    doc = get_transcript_by_id(session_id)

    if not doc:
        return jsonify({"error": "Session not found"}), 404

    doc["_id"] = str(doc["_id"])

    return jsonify(doc)
