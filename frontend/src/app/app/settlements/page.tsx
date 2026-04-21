"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { getGroups } from "@/services/groups";
import { getSettlementPlan, recordSettlement, getSettlementHistory } from "@/services/settlements";
import { useMarkSettlementPaidMutation } from "@/hooks/api-hooks";
import { generateUpiLink } from "@/services/payments";
import { ArrowRight, CheckCircle, Clock, TrendingUp } from "lucide-react";

type SettlementData = {
  groupId: string;
  groupName: string;
  plans: any[];
  history: any[];
};

export default function SettlementsPage() {
  const groupsQ = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const settlementsData: SettlementData[] = useMemo(() => {
    if (!groupsQ.data) return [];
    return groupsQ.data.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      plans: [],
      history: [],
    }));
  }, [groupsQ.data]);

  if (groupsQ.isPending) {
    return (
      <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Settlements</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Manage payments across all your groups.</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </BoneyardTransition>
    );
  }

  if (!groupsQ.data || groupsQ.data.length === 0) {
    return (
      <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Settlements</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Manage payments across all your groups.</p>
        </div>
        <Card className="p-12 text-center">
          <TrendingUp size={48} className="mx-auto mb-4 text-[#64748b] dark:text-[#57737A]" />
          <h3 className="text-xl font-semibold text-[#0f172a] dark:text-[#C2FCF7] mb-2">No Groups Yet</h3>
          <p className="text-[#64748b] dark:text-[#57737A] mb-6">Create a group to start tracking expenses and settlements.</p>
          <Link href="/app/groups/new">
            <Button variant="primary">Create Your First Group</Button>
          </Link>
        </Card>
      </BoneyardTransition>
    );
  }

  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Settlements</h1>
        <p className="text-[#475569] dark:text-[#85BDBF]">Manage payments across all your groups.</p>
      </div>

      <div className="space-y-8">
        {settlementsData.map((data) => (
          <SettlementGroupSection key={data.groupId} data={data} />
        ))}
      </div>
    </BoneyardTransition>
  );
}

function SettlementGroupSection({ data }: { data: SettlementData }) {
  const planQ = useQuery({
    queryKey: ["settlement-plan", data.groupId],
    queryFn: () => getSettlementPlan(data.groupId),
  });

  const historyQ = useQuery({
    queryKey: ["settlements", data.groupId],
    queryFn: () => getSettlementHistory(data.groupId),
  });

  const recordMut = useMutation({
    mutationFn: (req: any) => recordSettlement(data.groupId, req),
    onSuccess: () => {
      toast.success("Settlement recorded");
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : "Failed to record settlement";
      toast.error(message);
    },
  });

  const markPaidMut = useMarkSettlementPaidMutation(data.groupId);

  const upiMut = useMutation({
    mutationFn: generateUpiLink,
    onSuccess: (resp: any) => {
      window.location.href = resp.upiLink;
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : "Failed to generate UPI link";
      toast.error(message);
    },
  });

  const memberById = useMemo(() => {
    const map = new Map<string, { name: string; upi?: string | null }>();
    return map;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link 
          href={`/app/groups/${data.groupId}`}
          className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF] hover:underline"
        >
          {data.groupName}
        </Link>
        <Link href={`/app/groups/${data.groupId}/settle`}>
          <Button variant="secondary" className="text-sm px-4 py-1.5">View Details</Button>
        </Link>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-[#64748b] dark:text-[#57737A] uppercase tracking-wider mb-4">
          Pending Settlements
        </h3>
        {planQ.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
          </div>
        ) : planQ.data && planQ.data.length > 0 ? (
          <div className="space-y-3">
            {planQ.data.slice(0, 3).map((p: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] dark:bg-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#0f172a] dark:text-[#C2FCF7]">{p.from}</span>
                    <ArrowRight size={16} className="text-[#64748b] dark:text-[#57737A]" />
                    <span className="font-medium text-[#0f172a] dark:text-[#C2FCF7]">{p.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#6366f1] dark:text-[#C9BFFF]">₹{Number(p.amount).toFixed(2)}</span>
                  <Button
                    variant="primary"
                    disabled={recordMut.isPending}
                    onClick={() => {
                      recordMut.mutate(
                        { payerId: p.from, receiverId: p.to, amount: Number(p.amount), paymentMethod: "UPI" },
                        {
                          onSuccess: () => {
                            toast.success("Settlement recorded");
                          },
                        }
                      );
                    }}
                    className="px-3 py-1.5 text-sm"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Record
                  </Button>
                </div>
              </div>
            ))}
            {planQ.data.length > 3 && (
              <Link href={`/app/groups/${data.groupId}/settle`}>
                <p className="text-sm text-[#6366f1] dark:text-[#C9BFFF] hover:underline cursor-pointer text-center">
                  View all {planQ.data.length} settlements →
                </p>
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#64748b] dark:text-[#57737A] text-center py-4">All settled up! ✓</p>
        )}
      </Card>

      {historyQ.data && historyQ.data.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-[#64748b] dark:text-[#57737A] uppercase tracking-wider mb-4">
            Recent History
          </h3>
          <div className="space-y-2">
            {historyQ.data.slice(0, 2).map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] dark:bg-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.payment_status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <div className="text-sm">
                    <span className="font-medium text-[#0f172a] dark:text-[#C2FCF7]">{s.payer_id}</span>
                    <span className="text-[#64748b] dark:text-[#57737A] mx-2">→</span>
                    <span className="font-medium text-[#0f172a] dark:text-[#C2FCF7]">{s.receiver_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#0f172a] dark:text-[#C2FCF7]">₹{Number(s.amount).toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    s.payment_status === 'completed' 
                      ? 'bg-green-400/10 text-green-600 dark:text-green-400' 
                      : 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {s.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
