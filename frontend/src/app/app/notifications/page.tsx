"use client";

import { toast } from "sonner";

import { useMarkNotificationReadMutation, useNotificationsQuery } from "@/hooks/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";

export default function NotificationsPage() {
  const q = useNotificationsQuery();
  const markReadMut = useMarkNotificationReadMutation();

  return (
    <div className="flex flex-1 justify-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>

        {q.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : q.data && q.data.length > 0 ? (
          <div className="space-y-3">
            {q.data.map((n) => (
              <Card key={n.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {n.title}{" "}
                    {!n.is_read ? (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Unread
                      </span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  {!n.is_read ? (
                    <Button
                      variant="outline"
                      disabled={markReadMut.isPending}
                      onClick={() => {
                        markReadMut.mutate(n.id, {
                          onSuccess: () => toast.success("Marked as read"),
                          onError: (err) => {
                            const message =
                              err instanceof ApiError ? err.message : "Failed to mark as read";
                            toast.error(message);
                          },
                        });
                      }}
                    >
                      Mark as read
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No notifications yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

