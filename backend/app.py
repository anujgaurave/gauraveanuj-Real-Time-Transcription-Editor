from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from datetime import datetime


from google_stt_worker import GoogleSTTWorker
from models.transcript_model import get_transcript_by_id
from bson import ObjectId
from models.db import transcript_collection
from datetime import datetime


app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading",
)

stt_worker = GoogleSTTWorker(socketio)

def serialize_transcript(doc):
    return {
        "id": str(doc["_id"]),
        "transcript": doc.get("transcript", {}),
        "words": doc.get("words", []),
    }

@socketio.on("connect")
def connect():
    print("🔌 Frontend connected")

@socketio.on("start_transcription")
def start_transcription():
    print("📡 start_transcription received")
    stt_worker.start_stream()

@socketio.on("stop_transcription")
def stop_transcription():
    print("⏹️ stop_transcription received")
    stt_worker.stop_stream()

@socketio.on("audio_chunk")
def receive_audio(data):
    stt_worker.push_audio(data)

@socketio.on("save_transcript")
def save_transcript(data):
    try:
        transcript_id = data.get("id")
        final_text = (data.get("finalText") or "").strip()
        words = data.get("wordTimeline", [])

        if not final_text:
            socketio.emit("save_error", {
                "message": "Final text is empty"
            })
            return

        if transcript_id:
            result = transcript_collection.update_one(
                {"_id": ObjectId(transcript_id)},
                {
                    "$set": {
                        "transcript.finalText": final_text,
                        "words": words,
                        "updatedAt": datetime.utcnow()
                    }
                }
            )

            if result.matched_count == 0:
                socketio.emit("save_error", {
                    "message": "Transcript not found"
                })
                return

            print("✏️ Transcript updated:", transcript_id)

        else:
            result = transcript_collection.insert_one({
                "transcript": {
                    "finalText": final_text
                },
                "words": words,
                "createdAt": datetime.utcnow(),
            })

            transcript_id = str(result.inserted_id)
            print("💾 Transcript saved:", transcript_id)

        socketio.emit("save_success", {
            "message": "Transcript saved successfully",
            "id": transcript_id
        })

    except Exception as e:
        print("❌ Save error:", e)
        socketio.emit("save_error", {
            "message": "Failed to save transcript"
        })



@socketio.on("load_transcript")
def load_transcript(data):
    try:
        session_id = data.get("id")
        if not session_id:
            socketio.emit("load_error", {
                "message": "Transcript ID missing"
            })
            return

        doc = get_transcript_by_id(session_id)
        if not doc:
            socketio.emit("load_error", {
                "message": "Transcript not found"
            })
            return

        clean_doc = {
            "id": str(doc["_id"]),
            "transcript": {
                "finalText": doc.get("transcript", {}).get("finalText", ""),
                "editedText": doc.get("transcript", {}).get("editedText"),
            },
            "words": doc.get("words", []),
            "audio": {
                "url": doc.get("audio", {}).get("url"),
                "duration": doc.get("audio", {}).get("duration"),
            },
            "createdAt": doc["createdAt"].isoformat()
            if doc.get("createdAt") else None,
        }

        socketio.emit("load_success", {
            "transcript": clean_doc
        })

        print("📂 Transcript loaded:", clean_doc["id"])

    except Exception as e:
        print("❌ Load error:", e)
        socketio.emit("load_error", {
            "message": "Failed to load transcript"
        })
if __name__ == "__main__":
    print("🚀 Transcription Backend Running (SAFE MODE)")
    socketio.run(app, host="0.0.0.0", port=5000)
