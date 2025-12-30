import React from "react";

export default function LiveTranscript({ liveText }) {
  return (
    <div className="transcript-box">
      <h3>Live Transcription</h3>
      <p className="live-text">
        {liveText || "Speak to see live text…"}
      </p>
    </div>
  );
}
