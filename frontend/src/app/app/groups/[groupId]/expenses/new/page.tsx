"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { useAddExpenseMutation, useGroupQuery } from "@/hooks/api-hooks";

const schema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
  paidBy: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function NewExpensePage() {
  const params = useParams<{ groupId: string }>();
  const router = useRouter();
  const groupId = params.groupId;

  const groupQ = useGroupQuery(groupId);
  const addMut = useAddExpenseMutation(groupId);

  const memberIds = useMemo(
    () => (groupQ.data?.members ?? []).map((m) => m.user_id),
    [groupQ.data?.members]
  );

  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    // Initialize participants from group members once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (participants.length === 0 && memberIds.length > 0) setParticipants(memberIds);
  }, [memberIds, participants.length]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "", paidBy: "" },
  });

  useEffect(() => {
    const first = memberIds[0];
    if (!first) return;
    if (!form.getValues("paidBy")) form.setValue("paidBy", first);
  }, [form, memberIds]);

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add expense</CardTitle>
          <CardDescription>
            MVP supports equal split (all selected participants share equally).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              addMut.mutate(
                {
                  amount: values.amount,
                  paidBy: values.paidBy,
                  description: values.description,
                  splitType: "equal",
                  participants,
                },
                {
                  onSuccess: () => {
                    toast.success("Expense added");
                    router.replace(`/app/groups/${groupId}/expenses`);
                  },
                  onError: (err) => {
                    const message =
                      err instanceof ApiError ? err.message : "Failed to add expense";
                    toast.error(message);
                  },
                }
              );
            })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...form.register("amount", { valueAsNumber: true })}
                />
                {form.formState.errors.amount ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.amount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid by (userId)</Label>
                <Input id="paidBy" placeholder="user_uuid" {...form.register("paidBy")} />
                <p className="text-xs text-muted-foreground">
                  Tip: paste a member user ID.
                </p>
                {form.formState.errors.paidBy ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.paidBy.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...form.register("description")} />
            </div>

            <div className="space-y-2">
              <Label>Participants</Label>
              {groupQ.data?.members?.length ? (
                <div className="flex flex-wrap gap-2">
                  {groupQ.data.members.map((m) => {
                    const id = m.user_id;
                    const selected = participants.includes(id);
                    const label = m.user?.name ?? id.slice(0, 8);
                    return (
                      <Button
                        key={id}
                        type="button"
                        variant={selected ? "secondary" : "outline"}
                        onClick={() =>
                          setParticipants((prev) =>
                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                          )
                        }
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Add members to the group first to pick participants.
                </p>
              )}
              {participants.length === 0 ? (
                <p className="text-sm text-destructive">Select at least one participant.</p>
              ) : null}
            </div>

            <Button type="submit" disabled={addMut.isPending || participants.length === 0}>
              {addMut.isPending ? "Saving…" : "Add expense"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

