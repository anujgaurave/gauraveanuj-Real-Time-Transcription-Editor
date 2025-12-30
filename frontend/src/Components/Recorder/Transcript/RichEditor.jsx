import React, { useEffect, useRef } from "react";

export default function RichEditor({
  isEditing,
  draftText,
  onSave,
  onCancel,
}) {
  const editorRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isEditing && editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = draftText || "";


      editorRef.current.focus();
      initializedRef.current = true;
    }

    
    if (!isEditing) {
      initializedRef.current = false;
    }
  }, [isEditing, draftText]);

  return (
    <div
      className="transcript-box"
      style={{ display: isEditing ? "block" : "none" }}
    >
      <h3>Edit Transcript</h3>

      
      <div className="editor-toolbar">
        <button type="button" onClick={() => document.execCommand("bold")}>
          B
        </button>
        <button type="button" onClick={() => document.execCommand("italic")}>
          I
        </button>
        <button type="button" onClick={() => document.execCommand("underline")}>
          U
        </button>
        <button type="button" onClick={() => document.execCommand("undo")}>
          ↩
        </button>
        <button type="button" onClick={() => document.execCommand("redo")}>
          ↪
        </button>
      </div>

      
      <div
        ref={editorRef}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
      />

      <div className="edit-actions">
        <button
          onClick={() => onSave(editorRef.current.innerHTML)}
        >
          Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
