"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/antigravity/Button";
import { Card } from "@/components/antigravity/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useGroupQuery, useMarkSettlementPaidMutation, useRecordSettlementMutation, useSettlementHistoryQuery, useSettlementPlanQuery } from "@/hooks/api-hooks";
import { generateUpiLink } from "@/services/payments";
import { ArrowRight, CheckCircle, CreditCard, History } from "lucide-react";

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
    <div className="flex flex-1 justify-center px-4 py-6 space-y-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">Settle Up</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Manage payments and track settlement history for this group.</p>
        </div>

        {/* Recommended Payments */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 flex items-center justify-center text-[#6366f1] dark:text-[#C9BFFF]">
              <CreditCard size={24} />
            </div>
            <h2 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Recommended Payments</h2>
          </div>
          <div className="space-y-3">
            {planQ.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : planQ.data && planQ.data.length > 0 ? (
              planQ.data.map((p, idx) => {
                const from = memberById.get(p.from)?.name ?? p.from;
                const to = memberById.get(p.to)?.name ?? p.to;
                const receiverUpi = memberById.get(p.to)?.upi ?? null;
                return (
                  <div
                    key={`${p.from}-${p.to}-${idx}`}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] dark:from-[#57737A]/5 dark:to-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30 hover:border-[#6366f1]/30 dark:hover:border-[#C9BFFF]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2 text-base">
                        <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{from}</span>
                        <ArrowRight size={18} className="text-[#64748b] dark:text-[#57737A]" />
                        <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{to}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-[#6366f1] dark:text-[#C9BFFF] drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]">₹{Number(p.amount).toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
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
                          className="px-4 py-2"
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
                          className="px-4 py-2"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Record
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <p className="text-lg font-medium text-[#0f172a] dark:text-[#C2FCF7]">All settled up!</p>
                <p className="text-sm text-[#64748b] dark:text-[#57737A] mt-1">No pending settlements in this group.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Settlement History */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 flex items-center justify-center text-[#6366f1] dark:text-[#C9BFFF]">
              <History size={24} />
            </div>
            <h2 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Settlement History</h2>
          </div>
          <div className="space-y-3">
            {historyQ.isPending ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : historyQ.data && historyQ.data.length > 0 ? (
              historyQ.data.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] dark:from-[#57737A]/5 dark:to-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${s.payment_status === 'completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'}`} />
                    <div className="text-base">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{(memberById.get(s.payer_id)?.name ?? s.payer_id)}</span>
                        <ArrowRight size={16} className="text-[#64748b] dark:text-[#57737A]" />
                        <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{(memberById.get(s.receiver_id)?.name ?? s.receiver_id)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#64748b] dark:text-[#57737A]">₹{Number(s.amount).toFixed(2)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.payment_status === 'completed'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {s.payment_status ?? "pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
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
                      className="px-4 py-2"
                    >
                      Mark paid
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <History size={48} className="mx-auto mb-3 text-[#64748b] dark:text-[#57737A]" />
                <p className="text-lg font-medium text-[#0f172a] dark:text-[#C2FCF7]">No history yet</p>
                <p className="text-sm text-[#64748b] dark:text-[#57737A] mt-1">Settlements will appear here once recorded.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

