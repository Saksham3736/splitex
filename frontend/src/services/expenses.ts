import { apiFetch } from "@/lib/api";
import type { Expense, Id, SplitType } from "@/types/api";

export type AddExpenseRequest = {
  amount: number;
  paidBy: Id;
  description?: string;
  splitType: SplitType;
  participants: Id[];
  // Optional fields for exact/percentage splits (backend contract TBD)
  shares?: Array<{ userId: Id; amount?: number; percentage?: number }>;
};

export async function addExpense(groupId: Id, req: AddExpenseRequest) {
  return apiFetch<Expense>(`/groups/${groupId}/expenses`, {
    method: "POST",
    json: req,
  });
}

export async function getExpenses(groupId: Id) {
  return apiFetch<Expense[]>(`/groups/${groupId}/expenses`, { method: "GET" });
}

export async function getExpense(expenseId: Id) {
  return apiFetch<Expense>(`/expenses/${expenseId}`, { method: "GET" });
}

export async function updateExpense(expenseId: Id, patch: Partial<AddExpenseRequest>) {
  return apiFetch<Expense>(`/expenses/${expenseId}`, {
    method: "PUT",
    json: patch,
  });
}

export async function deleteExpense(expenseId: Id) {
  return apiFetch<unknown>(`/expenses/${expenseId}`, { method: "DELETE" });
}

