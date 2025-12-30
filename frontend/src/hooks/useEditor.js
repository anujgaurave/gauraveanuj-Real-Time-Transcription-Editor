import { useState } from "react";

export function useEditor(finalText, setFinalText, setWordTimeline) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");

  const startEditing = () => {
    setDraftText(finalText);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftText("");
    setIsEditing(false);
  };

  const saveEditing = (html) => {
    if (!html.trim()) return;

    setFinalText(html);

    const words = html
      .replace(/<[^>]+>/g, "")
      .trim()
      .split(/\s+/)
      .map((w, i) => ({ word: w, index: i }));

    setWordTimeline(words);
    setIsEditing(false);
  };

  return {
    isEditing,
    draftText,
    setDraftText,
    startEditing,
    cancelEditing,
    saveEditing,
  };
}
