import queue
import threading
from google.cloud import speech

class GoogleSTTWorker:
    def __init__(self, socketio):
        self.client = speech.SpeechClient()
        self.socketio = socketio
        self.audio_queue = queue.Queue()
        self.running = False
        self.thread = None

        # 🔹 session state
        self.final_text_parts = []
        self.words = []

    
    def start_stream(self):
        if self.running:
            return

        self.running = True
        self.final_text_parts = []
        self.words = []

        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

        self.socketio.emit("stt_ready")
        print("🎙️ STT started")

    
    def stop_stream(self):
        self.running = False
        self.audio_queue.put(None)

        
        print("⏹️ STT stopped")

    
    def push_audio(self, audio_bytes):
        if self.running:
            self.audio_queue.put(audio_bytes)

    
    def _run(self):
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
            enable_word_time_offsets=True,
        )

        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True,
        )

        def request_generator():
            print("📤 Google stream generator started")
            while self.running:
                audio = self.audio_queue.get()
                if audio is None:
                    break

                yield speech.StreamingRecognizeRequest(
                    audio_content=audio
                )

        try:
            responses = self.client.streaming_recognize(
                streaming_config,
                request_generator(),
            )

            for response in responses:
                for result in response.results:
                    if not result.alternatives:
                        continue

                    alt = result.alternatives[0]
                    text = alt.transcript.strip()

                    if not text:
                        continue

                    
                    if result.is_final:
                        self.final_text_parts.append(text)

                        for w in alt.words:
                            self.words.append({
                                "word": w.word,
                                "start": w.start_time.total_seconds(),
                                "end": w.end_time.total_seconds(),
                                "index": len(self.words)
                            })

                        self.socketio.emit("final_text", {
                            "text": text,
                            "words": self.words
                        })

                    
                    else:
                        self.socketio.emit("live_text", {
                            "text": text
                        })

        except Exception as e:
            print("⚠️ STT error:", e)
