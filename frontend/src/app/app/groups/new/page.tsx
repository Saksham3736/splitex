"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { useCreateGroupMutation } from "@/hooks/api-hooks";

const schema = z.object({
  name: z.string().min(2),
  membersCsv: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function NewGroupPage() {
  const router = useRouter();
  const mutation = useCreateGroupMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", membersCsv: "" },
  });

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create group</CardTitle>
          <CardDescription>
            Give your group a name. Add member user IDs (comma-separated) if you have them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              const members = values.membersCsv
                ? values.membersCsv
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [];

              mutation.mutate(
                { name: values.name, members },
                {
                  onSuccess: (g) => {
                    toast.success("Group created");
                    router.replace(`/app/groups/${g.id}`);
                  },
                  onError: (err) => {
                    const message =
                      err instanceof ApiError ? err.message : "Failed to create group";
                    toast.error(message);
                  },
                }
              );
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Group name</Label>
              <Input id="name" placeholder="Goa Trip" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="membersCsv">Member user IDs (optional)</Label>
              <Textarea
                id="membersCsv"
                placeholder="user1,user2,user3"
                rows={3}
                {...form.register("membersCsv")}
              />
              <p className="text-xs text-muted-foreground">
                If you don’t know user IDs yet, create the group first and add members later.
              </p>
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating…" : "Create group"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

