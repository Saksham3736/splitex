"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useAddGroupMemberMutation, useGroupQuery, useRemoveGroupMemberMutation } from "@/hooks/api-hooks";

const schema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

type FormValues = z.infer<typeof schema>;

export default function GroupMembersPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;

  const groupQ = useGroupQuery(groupId);
  const addMut = useAddGroupMemberMutation(groupId);
  const removeMut = useRemoveGroupMemberMutation(groupId);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { userId: "" },
  });

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Members</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add member</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={form.handleSubmit((values) => {
                addMut.mutate(values.userId, {
                  onSuccess: () => {
                    toast.success("Member added");
                    form.reset({ userId: "" });
                  },
                  onError: (err) => {
                    const message =
                      err instanceof ApiError ? err.message : "Failed to add member";
                    toast.error(message);
                  },
                });
              })}
            >
              <div className="flex-1 space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" placeholder="user_uuid" {...form.register("userId")} />
                {form.formState.errors.userId ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.userId.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" disabled={addMut.isPending}>
                {addMut.isPending ? "Adding…" : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {groupQ.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : groupQ.data?.members && groupQ.data.members.length > 0 ? (
              <div className="space-y-2">
                {groupQ.data.members.map((m) => (
                  <div
                    key={m.user_id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {m.user?.name ?? m.user_id}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {m.user?.email ?? m.user_id}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        removeMut.mutate(m.user_id, {
                          onSuccess: () => toast.success("Member removed"),
                          onError: (err) => {
                            const message =
                              err instanceof ApiError ? err.message : "Failed to remove member";
                            toast.error(message);
                          },
                        });
                      }}
                      disabled={removeMut.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No members found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

