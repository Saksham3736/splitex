"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useGroupQuery, useMarkSettlementPaidMutation, useRecordSettlementMutation, useSettlementHistoryQuery, useSettlementPlanQuery } from "@/hooks/api-hooks";
import { generateUpiLink } from "@/services/payments";

export default function GroupSettlePage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const groupQ = useGroupQuery(groupId);
  const planQ = useSettlementPlanQuery(groupId);
  const historyQ = useSettlementHistoryQuery(groupId);

  const recordMut = useRecordSettlementMutation(groupId);
  const markPaidMut = useMarkSettlementPaidMutation(groupId);

  const memberById = useMemo(() => {
    const map = new Map<string, { name: string; upi?: string | null }>();
    for (const m of groupQ.data?.members ?? []) {
      map.set(m.user_id, {
        name: m.user?.name ?? m.user_id,
        upi: m.user?.upi_id ?? null,
      });
    }
    return map;
  }, [groupQ.data?.members]);

  const upiMut = useMutation({
    mutationFn: generateUpiLink,
    onSuccess: (data) => {
      window.location.href = data.upiLink;
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : "Failed to generate UPI link";
      toast.error(message);
    },
  });

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Settle up</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {planQ.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : planQ.data && planQ.data.length > 0 ? (
              planQ.data.map((p, idx) => {
                const from = memberById.get(p.from)?.name ?? p.from;
                const to = memberById.get(p.to)?.name ?? p.to;
                const receiverUpi = memberById.get(p.to)?.upi ?? null;
                return (
                  <div
                    key={`${p.from}-${p.to}-${idx}`}
                    className="flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        {from} → {to}
                      </div>
                      <div className="text-muted-foreground">₹{Number(p.amount).toFixed(2)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        disabled={upiMut.isPending}
                        onClick={() => {
                          let upi = receiverUpi;
                          if (!upi) {
                            upi = window.prompt("Receiver UPI ID not available. Enter UPI ID:") ?? "";
                          }
                          if (!upi) return;
                          upiMut.mutate({
                            amount: Number(p.amount),
                            receiverUpi: upi,
                            name: to,
                          });
                        }}
                      >
                        Pay via UPI
                      </Button>
                      <Button
                        disabled={recordMut.isPending}
                        onClick={() => {
                          recordMut.mutate(
                            { payerId: p.from, receiverId: p.to, amount: Number(p.amount), paymentMethod: "UPI" },
                            {
                              onSuccess: () => toast.success("Settlement recorded"),
                              onError: (err) => {
                                const message =
                                  err instanceof ApiError ? err.message : "Failed to record settlement";
                                toast.error(message);
                              },
                            }
                          );
                        }}
                      >
                        Record
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No settlements needed.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settlement history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {historyQ.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : historyQ.data && historyQ.data.length > 0 ? (
              historyQ.data.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      {(memberById.get(s.payer_id)?.name ?? s.payer_id)} →{" "}
                      {(memberById.get(s.receiver_id)?.name ?? s.receiver_id)}
                    </div>
                    <div className="text-muted-foreground">
                      ₹{Number(s.amount).toFixed(2)} • {s.payment_status ?? "pending"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={s.payment_status === "completed" || markPaidMut.isPending}
                      onClick={() => {
                        markPaidMut.mutate(s.id, {
                          onSuccess: () => toast.success("Marked as paid"),
                          onError: (err) => {
                            const message =
                              err instanceof ApiError ? err.message : "Failed to mark paid";
                            toast.error(message);
                          },
                        });
                      }}
                    >
                      Mark paid
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No settlement history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

