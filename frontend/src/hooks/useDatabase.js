import { useState } from "react";
import { socket } from "../services/socket";

export default function useDatabase({
  finalText,
  wordTimeline,
  sessionIdRef,
}) {
  const [loadedId, setLoadedId] = useState("");

  const saveToDatabase = () => {
    if (!finalText || typeof finalText !== "string") return;

    const cleanText = finalText.trim();
    if (!cleanText) return;

    socket.emit("save_transcript", {
      id: sessionIdRef.current || null,
      finalText: cleanText,
      wordTimeline: Array.isArray(wordTimeline) ? wordTimeline : [],
    });
  };

  const loadFromDatabase = () => {
    if (!loadedId.trim()) return;

    socket.emit("load_transcript", {
      id: loadedId.trim(),
    });
  };

  return {
    loadedId,
    setLoadedId,
    saveToDatabase,
    loadFromDatabase,
  };
}
