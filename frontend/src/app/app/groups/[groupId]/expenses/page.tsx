"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useExpensesQuery } from "@/hooks/api-hooks";

export default function GroupExpensesPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const q = useExpensesQuery(groupId);

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-3xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Expenses</h1>
          <Link
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            href={`/app/groups/${groupId}/expenses/new`}
          >
            Add expense
          </Link>
        </div>

        {q.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : q.data && q.data.length > 0 ? (
          <div className="space-y-3">
            {q.data.map((e) => (
              <Card key={e.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {e.description || "Expense"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    ₹{Number(e.amount).toFixed(2)}
                  </p>
                  <Link
                    className="text-sm font-medium underline underline-offset-4"
                    href={`/app/expenses/${e.id}`}
                  >
                    Details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No expenses yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

