import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export function useTranscription(readyRef) {
  const [liveText, setLiveText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [wordTimeline, setWordTimeline] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    socket.on("stt_ready", () => {
      readyRef.current = true;
    });

    socket.on("live_text", (d) => {
      if (d?.text) setLiveText(d.text);
    });

    socket.on("final_text", (d) => {
      if (!d?.text) return;

      setFinalText((p) => p + " " + d.text);

      if (Array.isArray(d.words)) {
        setWordTimeline(d.words);
      }

      setTimeout(() => setLiveText(""), 500);
    });

    socket.on("load_success", (data) => {
      const t = data.transcript;

      setFinalText(t.transcript?.finalText || "");
      setWordTimeline(t.words || []);
      setLiveText("");

      readyRef.current = false;
    });

    socket.on("load_error", (data) => {
      setAlert({ type: "error", message: data.message });
    });

    return () => {
      socket.off("stt_ready");
      socket.off("live_text");
      socket.off("final_text");
      socket.off("load_success");
      socket.off("load_error");
    };
  }, []);

  return {
    liveText,
    finalText,
    setFinalText,
    wordTimeline,
    setWordTimeline,
    alert,
    setAlert,
  };
}
