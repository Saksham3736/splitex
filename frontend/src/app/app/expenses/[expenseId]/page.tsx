"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useDeleteExpenseMutation, useExpenseQuery } from "@/hooks/api-hooks";

export default function ExpenseDetailPage() {
  const params = useParams<{ expenseId: string }>();
  const router = useRouter();
  const expenseId = params.expenseId;

  const q = useExpenseQuery(expenseId);
  const delMut = useDeleteExpenseMutation(expenseId, q.data?.group_id ?? "");

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-4">
        {q.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : q.data ? (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              {q.data.description || "Expense"}
            </h1>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{Number(q.data.amount).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Split type</span>
                  <span className="font-medium">{q.data.split_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Paid by</span>
                  <span className="font-medium">{q.data.paid_by}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/app/groups/${q.data.group_id}/expenses`)}
              >
                Back to expenses
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/app/expenses/${expenseId}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                disabled={delMut.isPending}
                onClick={() => {
                  delMut.mutate(undefined, {
                    onSuccess: () => {
                      toast.success("Expense deleted");
                      router.replace(`/app/groups/${q.data.group_id}/expenses`);
                    },
                    onError: (err) => {
                      const message =
                        err instanceof ApiError ? err.message : "Failed to delete expense";
                      toast.error(message);
                    },
                  });
                }}
              >
                {delMut.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Expense not found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

