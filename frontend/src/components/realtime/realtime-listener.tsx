"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { disconnectSocket, getSocket } from "@/lib/socket";
import { qk } from "@/hooks/api-hooks";

type GroupEventPayload = {
  groupId?: string;
  expenseId?: string;
  settlementId?: string;
  notificationId?: string;
};

export function RealtimeListener() {
  const token = useAuthStore((s) => s.token);
  const qc = useQueryClient();

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    const socket = getSocket(token);

    const invalidateGroup = async (groupId?: string) => {
      if (!groupId) return;
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.group(groupId) }),
        qc.invalidateQueries({ queryKey: qk.expenses(groupId) }),
        qc.invalidateQueries({ queryKey: qk.balances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.netBalances(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlementPlan(groupId) }),
        qc.invalidateQueries({ queryKey: qk.settlements(groupId) }),
      ]);
    };

    const onExpense = (payload: GroupEventPayload) => invalidateGroup(payload.groupId);
    const onBalances = (payload: GroupEventPayload) => invalidateGroup(payload.groupId);
    const onSettlement = (payload: GroupEventPayload) => invalidateGroup(payload.groupId);
    const onNotification = async () => {
      await qc.invalidateQueries({ queryKey: qk.notifications() });
    };

    socket.on("group:expense_created", onExpense);
    socket.on("group:expense_updated", onExpense);
    socket.on("group:expense_deleted", onExpense);
    socket.on("group:balances_updated", onBalances);
    socket.on("group:settlement_created", onSettlement);
    socket.on("group:settlement_paid", onSettlement);
    socket.on("user:notification_created", onNotification);

    return () => {
      socket.off("group:expense_created", onExpense);
      socket.off("group:expense_updated", onExpense);
      socket.off("group:expense_deleted", onExpense);
      socket.off("group:balances_updated", onBalances);
      socket.off("group:settlement_created", onSettlement);
      socket.off("group:settlement_paid", onSettlement);
      socket.off("user:notification_created", onNotification);
    };
  }, [qc, token]);

  return null;
}

