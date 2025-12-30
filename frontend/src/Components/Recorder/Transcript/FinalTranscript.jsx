import React from "react";

export default function FinalTranscript({
  finalText,
  isEditing,
  onEdit,
}) {
  if (isEditing) return null;

  return (
    <div className="transcript-box">
      <h3>Final Transcript</h3>

      <div
        className="final-text"
        dangerouslySetInnerHTML={{
          __html: finalText || "Final transcript here",
        }}
      />

      {finalText && (
        <button className="btn-edit" onClick={onEdit}>
          ✏️ Edit
        </button>
      )}
    </div>
  );
}
