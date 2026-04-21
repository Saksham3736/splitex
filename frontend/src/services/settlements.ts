import { apiFetch } from "@/lib/api";
import type { Id, Settlement, SettlementPlanItem } from "@/types/api";

export async function getSettlementPlan(groupId: Id) {
  return apiFetch<SettlementPlanItem[]>(`/groups/${groupId}/settlement-plan`, {
    method: "GET",
  });
}

export type RecordSettlementRequest = {
  payerId: Id;
  receiverId: Id;
  amount: number;
  paymentMethod?: string;
  transactionRef?: string;
};

export async function recordSettlement(groupId: Id, req: RecordSettlementRequest) {
  return apiFetch<Settlement>(`/groups/${groupId}/settlements`, {
    method: "POST",
    json: req,
  });
}

export async function markSettlementPaid(settlementId: Id) {
  return apiFetch<Settlement>(`/settlements/${settlementId}/paid`, {
    method: "PUT",
  });
}

export async function getSettlementHistory(groupId: Id) {
  return apiFetch<Settlement[]>(`/groups/${groupId}/settlements`, { method: "GET" });
}

