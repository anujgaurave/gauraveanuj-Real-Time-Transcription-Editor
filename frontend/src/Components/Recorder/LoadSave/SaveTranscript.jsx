import React from "react";

export default function SaveTranscript({
  isStopped,
  saving,
  onSave,
}) {
  if (!isStopped) return null;

  return (
    <div className="save-box">
      <button
        className="btn-save-db"
        disabled={saving}
        onClick={onSave}
      >
        📤 Save to Database
      </button>
    </div>
  );
}
