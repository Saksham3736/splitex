import { io, type Socket } from "socket.io-client";

import { API_BASE_URL } from "@/lib/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  // default: strip trailing /api if present
  API_BASE_URL.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export function getSocket(token: string) {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

