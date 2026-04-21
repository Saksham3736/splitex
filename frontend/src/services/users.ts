import { apiFetch } from "@/lib/api";
import type { Id, User } from "@/types/api";

export async function getUser(userId: Id) {
  return apiFetch<User>(`/users/${userId}`, { method: "GET" });
}

export async function updateUser(userId: Id, patch: Partial<User>) {
  return apiFetch<User>(`/users/${userId}`, { method: "PUT", json: patch });
}

export async function updateUserUpi(userId: Id, upiId: string) {
  return apiFetch<User>(`/users/${userId}/upi`, {
    method: "PUT",
    json: { upiId },
  });
}

