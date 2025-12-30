import { useRef, useState } from "react";
import { socket } from "../services/socket";
import { pcm16ToWav } from "../services/audioUtils";

export function useRecorderCore() {
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const readyRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  const startRecording = async () => {
    readyRef.current = false;
    audioChunksRef.current = [];
    setSeconds(0);
    setIsStopped(false);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    socket.emit("start_transcription");

    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      if (!readyRef.current) return;

      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(input.length);

      for (let i = 0; i < input.length; i++) {
        pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff;
      }

      audioChunksRef.current.push(pcm16);
      socket.emit("audio_chunk", pcm16.buffer);
    };

    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    socket.emit("stop_transcription");

    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(timerRef.current);

    const totalLength = audioChunksRef.current.reduce((s, a) => s + a.length, 0);
    const pcm = new Int16Array(totalLength);
    let offset = 0;

    for (const chunk of audioChunksRef.current) {
      pcm.set(chunk, offset);
      offset += chunk.length;
    }

    const wavBlob = pcm16ToWav(pcm);
    setAudioUrl(URL.createObjectURL(wavBlob));

    setIsRecording(false);
    setIsStopped(true);
  };

  return {
    isRecording,
    isStopped,
    setIsStopped,   
    seconds,
    audioUrl,
    readyRef,
    startRecording,
    stopRecording,
  };
}
