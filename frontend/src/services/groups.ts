import { apiFetch } from "@/lib/api";
import type { Group, Id } from "@/types/api";

export type CreateGroupRequest = {
  name: string;
  members: Id[];
};

export async function createGroup(req: CreateGroupRequest) {
  return apiFetch<Group>("/groups", { method: "POST", json: req });
}

export async function getGroups() {
  return apiFetch<Group[]>("/groups", { method: "GET" });
}

export async function getGroup(groupId: Id) {
  return apiFetch<Group>(`/groups/${groupId}`, { method: "GET" });
}

export async function addGroupMember(groupId: Id, userId: Id) {
  return apiFetch<unknown>(`/groups/${groupId}/members`, {
    method: "POST",
    json: { userId },
  });
}

export async function removeGroupMember(groupId: Id, userId: Id) {
  return apiFetch<unknown>(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
}

