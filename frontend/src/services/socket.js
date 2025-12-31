import { io } from "socket.io-client";

const SOCKET_URL = "https://gauraveanuj-real-time-transcription.onrender.com"


export const socket = io(SOCKET_URL, {
  transports: ["websocket"],   
  upgrade: false,             
  reconnection: true,
  timeout: 20000,
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});
