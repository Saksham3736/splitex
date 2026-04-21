"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Id } from "@/types/api";
import { getGroups, getGroup, createGroup, addGroupMember, removeGroupMember } from "@/services/groups";
import { getExpenses, getExpense, addExpense, updateExpense, deleteExpense } from "@/services/expenses";
import { getGroupBalances, getNetBalances } from "@/services/balances";
import {
  getSettlementPlan,
  recordSettlement,
  markSettlementPaid,
  getSettlementHistory,
} from "@/services/settlements";
import { getNotifications, markNotificationRead } from "@/services/notifications";

export const qk = {
  me: () => ["auth", "me"] as const,
  groups: () => ["groups"] as const,
  group: (groupId: Id) => ["groups", groupId] as const,
  expenses: (groupId: Id) => ["groups", groupId, "expenses"] as const,
  expense: (expenseId: Id) => ["expenses", expenseId] as const,
  balances: (groupId: Id) => ["groups", groupId, "balances"] as const,
  netBalances: (groupId: Id) => ["groups", groupId, "net-balances"] as const,
  settlementPlan: (groupId: Id) => ["groups", groupId, "settlement-plan"] as const,
  settlements: (groupId: Id) => ["groups", groupId, "settlements"] as const,
  notifications: () => ["notifications"] as const,
};

export function useGroupsQuery() {
  return useQuery({ queryKey: qk.groups(), queryFn: getGroups });
}

export function useGroupQuery(groupId: Id) {
  return useQuery({ queryKey: qk.group(groupId), queryFn: () => getGroup(groupId) });
}

export function useCreateGroupMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.groups() });
    },
  });
}

export function useAddGroupMemberMutation(groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: Id) => addGroupMember(groupId, userId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.group(groupId) });
    },
  });
}

export function useRemoveGroupMemberMutation(groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: Id) => removeGroupMember(groupId, userId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.group(groupId) });
    },
  });
}

export function useExpensesQuery(groupId: Id) {
  return useQuery({ queryKey: qk.expenses(groupId), queryFn: () => getExpenses(groupId) });
}

export function useExpenseQuery(expenseId: Id) {
  return useQuery({ queryKey: qk.expense(expenseId), queryFn: () => getExpense(expenseId) });
}

export function useAddExpenseMutation(groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: Parameters<typeof addExpense>[1]) => addExpense(groupId, req),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.expenses(groupId) }),
        qc.invalidateQueries({ queryKey: qk.balances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.netBalances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) }),
      ]);
    },
  });
}

export function useUpdateExpenseMutation(expenseId: Id, groupId?: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Parameters<typeof updateExpense>[1]) => updateExpense(expenseId, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.expense(expenseId) });
      if (groupId) {
        await qc.invalidateQueries({ queryKey: qk.expenses(groupId) });
        await qc.invalidateQueries({ queryKey: qk.balances(groupId) });
        await qc.invalidateQueries({ queryKey: qk.netBalances(groupId) });
        await qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) });
      }
    },
  });
}

export function useDeleteExpenseMutation(expenseId: Id, groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteExpense(expenseId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.expenses(groupId) }),
        qc.invalidateQueries({ queryKey: qk.balances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.netBalances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) }),
      ]);
    },
  });
}

export function useBalancesQuery(groupId: Id) {
  return useQuery({ queryKey: qk.balances(groupId), queryFn: () => getGroupBalances(groupId) });
}

export function useNetBalancesQuery(groupId: Id) {
  return useQuery({ queryKey: qk.netBalances(groupId), queryFn: () => getNetBalances(groupId) });
}

export function useSettlementPlanQuery(groupId: Id) {
  return useQuery({
    queryKey: qk.settlementPlan(groupId),
    queryFn: () => getSettlementPlan(groupId),
  });
}

export function useSettlementHistoryQuery(groupId: Id) {
  return useQuery({
    queryKey: qk.settlements(groupId),
    queryFn: () => getSettlementHistory(groupId),
  });
}

export function useRecordSettlementMutation(groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: Parameters<typeof recordSettlement>[1]) => recordSettlement(groupId, req),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlements(groupId) }),
        qc.invalidateQueries({ queryKey: qk.balances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.netBalances(groupId) }),
      ]);
    },
  });
}

export function useMarkSettlementPaidMutation(groupId: Id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settlementId: Id) => markSettlementPaid(settlementId),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlements(groupId) }),
        qc.invalidateQueries({ queryKey: qk.balances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.netBalances(groupId) }),
      ]);
    },
  });
}

export function useNotificationsQuery() {
  return useQuery({ queryKey: qk.notifications(), queryFn: getNotifications });
}

export function useMarkNotificationReadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => markNotificationRead(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.notifications() });
    },
  });
}

