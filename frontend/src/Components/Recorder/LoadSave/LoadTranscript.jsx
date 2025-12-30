import React from "react";

export default function LoadTranscript({
  loadedId,
  setLoadedId,
  loadFromDatabase,
}) {
  return (
    <div className="load-box">
      <input
        type="text"
        placeholder="Paste Transcript ID"
        value={loadedId}
        onChange={(e) => setLoadedId(e.target.value)}
        className="load-input"
      />

      <button className="btn-load" onClick={loadFromDatabase}>
        📥 Load Transcript
      </button>
    </div>
  );
}
