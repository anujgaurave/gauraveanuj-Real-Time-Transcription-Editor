import React from "react";

export default function WordTimeline({
  wordTimeline,
  activeWordIndex,
  audioRef,
}) {
  if (!wordTimeline || wordTimeline.length === 0) return null;

  return (
    <div className="transcript-box">
      <h3>Word Timeline</h3>

      <div className="word-preview">
        {wordTimeline.map((w, i) => (
          <span
            key={i}
            className={`word-chip ${
              i === activeWordIndex ? "active-word" : ""
            }`}
            onClick={() => {
              if (audioRef.current && w.start !== undefined) {
                audioRef.current.currentTime = w.start;
                audioRef.current.play();
              }
            }}
          >
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
}
