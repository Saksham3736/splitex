import { apiFetch } from "@/lib/api";
import type { Id, Notification } from "@/types/api";

export async function getNotifications() {
  return apiFetch<Notification[]>("/notifications", { method: "GET" });
}

export async function markNotificationRead(id: Id) {
  return apiFetch<unknown>(`/notifications/${id}/read`, { method: "PUT" });
}

export async function sendReminder(payload: Record<string, unknown>) {
  return apiFetch<unknown>("/notifications/reminder", {
    method: "POST",
    json: payload,
  });
}

