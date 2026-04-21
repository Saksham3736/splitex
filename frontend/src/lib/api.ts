import { useAuthStore } from "@/store/auth-store";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export type ApiErrorShape = {
  success?: false;
  message?: string;
  error?: unknown;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  return useAuthStore.getState().token;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);

  if (init?.json !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const apiErr = body as ApiErrorShape | string | null;
    const message =
      (apiErr && typeof apiErr === "object" && apiErr.message) ||
      (typeof apiErr === "string" && apiErr) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, apiErr);
  }

  return body as T;
}

