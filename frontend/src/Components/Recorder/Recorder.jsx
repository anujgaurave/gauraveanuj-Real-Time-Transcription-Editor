import React, { useRef, useState } from "react";
import "./Recorder.css";


import StatusBar from "./StatusBar";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";
import WordTimeline from "./WordTimeline";
import AlertBox from "./AlertBox";
import LoadTranscript from "./LoadSave/LoadTranscript";
import SaveTranscript from "./LoadSave/SaveTranscript";
import LiveTranscript from "./Transcript/LiveTranscript";
import FinalTranscript from "./Transcript/FinalTranscript";
import RichEditor from "./Transcript/RichEditor";


import useRecorder from "../../hooks/useRecorder";

export default function Recorder() {
  const {
    isRecording,
    isStopped,
    seconds,
    liveText,
    finalText,
    wordTimeline,
    audioUrl,
    alert,

    loadedId,
    setLoadedId,
    loadFromDatabase,
    saveToDatabase,

    isEditing,
    startEditing,
    cancelEditing,
    saveEditing,

    startRecording,
    stopRecording,
  } = useRecorder();

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [saving, setSaving] = useState(false);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const activeWordIndex = wordTimeline.findIndex(
    (w) =>
      w.start !== undefined &&
      currentTime >= w.start &&
      currentTime <= w.end
  );

  return (
    <div className="recorder-page">
      <AlertBox alert={alert} />

      <h1 className="recorder-title">🎧 Real-Time Transcription</h1>

      <LoadTranscript
        loadedId={loadedId}
        setLoadedId={setLoadedId}
        loadFromDatabase={loadFromDatabase}
      />

      <StatusBar
        isRecording={isRecording}
        seconds={seconds}
        formatTime={formatTime}
      />

      <Controls
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />

      <AudioPlayer
        audioRef={audioRef}
        audioUrl={audioUrl}
        onTimeUpdate={() =>
          audioRef.current &&
          setCurrentTime(audioRef.current.currentTime)
        }
      />

      <LiveTranscript liveText={liveText} />

      <div className="transcript-box">
        <h3>Final Transcript</h3>

        <FinalTranscript
          finalText={finalText}
          isEditing={isEditing}
          onEdit={startEditing}
        />

        <RichEditor
          isEditing={isEditing}
          draftText={finalText}
          onSave={saveEditing}
          onCancel={cancelEditing}
        />
      </div>

      <WordTimeline
        wordTimeline={wordTimeline}
        activeWordIndex={activeWordIndex}
        audioRef={audioRef}
      />

      <SaveTranscript
        isStopped={isStopped}
        saving={saving}
        onSave={() => {
          setSaving(true);
          saveToDatabase();
        }}
      />
    </div>
  );
}
