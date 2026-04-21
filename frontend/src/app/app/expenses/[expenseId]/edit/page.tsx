"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useExpenseQuery, useUpdateExpenseMutation } from "@/hooks/api-hooks";

const schema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditExpensePage() {
  const params = useParams<{ expenseId: string }>();
  const router = useRouter();
  const expenseId = params.expenseId;

  const q = useExpenseQuery(expenseId);
  const mut = useUpdateExpenseMutation(expenseId, q.data?.group_id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "" },
  });

  useEffect(() => {
    if (!q.data) return;
    form.reset({ amount: Number(q.data.amount), description: q.data.description ?? "" });
  }, [form, q.data]);

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Edit expense</h1>

        {q.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : q.data ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{q.data.description || "Expense"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit((values) => {
                  mut.mutate(values, {
                    onSuccess: () => {
                      toast.success("Expense updated");
                      router.replace(`/app/expenses/${expenseId}`);
                    },
                    onError: (err) => {
                      const message =
                        err instanceof ApiError ? err.message : "Failed to update expense";
                      toast.error(message);
                    },
                  });
                })}
              >
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...form.register("amount", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={3} {...form.register("description")} />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={mut.isPending}>
                    {mut.isPending ? "Saving…" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/app/expenses/${expenseId}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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

