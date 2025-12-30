import { useRef, useEffect, useState } from "react";
import { socket } from "../services/socket";

import { useRecorderCore } from "./useRecorderCore";
import { useTranscription } from "./useTranscription";
import { useEditor } from "./useEditor";
import useDatabase from "./useDatabase";

export default function useRecorder() {
  const [alert, setAlert] = useState(null);

  const recorder = useRecorderCore();

  const transcription = useTranscription(recorder.readyRef);

  const sessionIdRef = useRef(null);

  const editor = useEditor(
    transcription.finalText,
    transcription.setFinalText,
    transcription.setWordTimeline
  );

  const database = useDatabase({
    finalText: transcription.finalText,
    wordTimeline: transcription.wordTimeline,
    sessionIdRef,
  });

  useEffect(() => {
    const handleSaveSuccess = (data) => {
      setAlert({
        type: "success",
        message: "Saved successfully",
      });

      if (data?.id) {
        sessionIdRef.current = data.id;
      }

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    };

    const handleSaveError = (data) => {
      setAlert({
        type: "error",
        message: data?.message || "Save failed",
      });
    };

    const handleLoadSuccess = (data) => {
      const t = data.transcript;

      sessionIdRef.current = t.id;

      transcription.setFinalText(t.transcript?.finalText || "");
      transcription.setWordTimeline(t.words || []);

      recorder.setIsStopped(true);

      setAlert({
        type: "success",
        message: "Transcript loaded",
      });
    };

    const handleLoadError = (data) => {
      setAlert({
        type: "error",
        message: data?.message || "Load failed",
      });
    };

    socket.on("save_success", handleSaveSuccess);
    socket.on("save_error", handleSaveError);
    socket.on("load_success", handleLoadSuccess);
    socket.on("load_error", handleLoadError);

    return () => {
      socket.off("save_success", handleSaveSuccess);
      socket.off("save_error", handleSaveError);
      socket.off("load_success", handleLoadSuccess);
      socket.off("load_error", handleLoadError);
    };
  }, []);

  return {
    ...recorder,
    ...transcription,
    ...editor,
    ...database,
    alert,
    sessionIdRef,
  };
}
