import React from "react";

export default function AudioPlayer({
  audioRef,
  audioUrl,
  onTimeUpdate,
}) {
  if (!audioUrl) return null;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        onTimeUpdate={onTimeUpdate}
      />
    </div>
  );
}
