import { apiFetch } from "@/lib/api";
import type { Balance, Id, NetBalances } from "@/types/api";

export async function getGroupBalances(groupId: Id) {
  return apiFetch<Balance[]>(`/groups/${groupId}/balances`, { method: "GET" });
}

export async function getNetBalances(groupId: Id) {
  return apiFetch<NetBalances>(`/groups/${groupId}/net-balances`, { method: "GET" });
}

