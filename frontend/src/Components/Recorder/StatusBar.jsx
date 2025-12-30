import React from "react";

export default function StatusBar({ isRecording, seconds }) {
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="status-bar">
      <span className={isRecording ? "status-recording" : "status-idle"}>
        {isRecording ? "🔴 Recording" : "Idle"}
      </span>
      <span className="timer">⏱ {formatTime(seconds)}</span>
    </div>
  );
}
