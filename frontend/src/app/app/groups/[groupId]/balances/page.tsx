"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBalancesQuery, useGroupQuery, useNetBalancesQuery } from "@/hooks/api-hooks";

export default function GroupBalancesPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const groupQ = useGroupQuery(groupId);
  const balancesQ = useBalancesQuery(groupId);
  const netQ = useNetBalancesQuery(groupId);

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of groupQ.data?.members ?? []) {
      map.set(m.user_id, m.user?.name ?? m.user_id);
    }
    return map;
  }, [groupQ.data?.members]);

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Balances</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Net balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {netQ.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : netQ.data ? (
              Object.entries(netQ.data)
                .sort((a, b) => b[1] - a[1])
                .map(([userId, amount]) => (
                  <div
                    key={userId}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{nameById.get(userId) ?? userId}</span>
                    <span className={amount >= 0 ? "text-emerald-600" : "text-rose-600"}>
                      ₹{Number(amount).toFixed(2)}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No data.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Who owes whom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {balancesQ.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : balancesQ.data && balancesQ.data.length > 0 ? (
              balancesQ.data.map((b, idx) => (
                <div
                  key={b.id ?? `${b.from_user_id}-${b.to_user_id}-${idx}`}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium">
                      {nameById.get(b.from_user_id) ?? b.from_user_id}
                    </span>{" "}
                    owes{" "}
                    <span className="font-medium">
                      {nameById.get(b.to_user_id) ?? b.to_user_id}
                    </span>
                  </span>
                  <span className="font-medium">₹{Number(b.amount).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No balances to show.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

