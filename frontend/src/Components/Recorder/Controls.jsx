import React from "react";

export default function Controls({
  isRecording,
  startRecording,
  stopRecording,
}) {
  return (
    <div className="controls">
      {!isRecording ? (
        <button className="btn-start" onClick={startRecording}>
          Start
        </button>
      ) : (
        <button className="btn-stop" onClick={stopRecording}>
          Stop
        </button>
      )}
    </div>
  );
}
