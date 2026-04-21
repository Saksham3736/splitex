"use client";

import { toast } from "sonner";

import { useMarkNotificationReadMutation, useNotificationsQuery } from "@/hooks/api-hooks";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { Check, Mail } from "lucide-react";

const DEMO_NOTIFICATIONS = [
  {
    id: "demo-1",
    title: "Expense Added in Goa Trip 2026",
    message: "Rahul added Dinner at Thalassa (INR 2,450). Your share is INR 816.67.",
    is_read: false,
  },
  {
    id: "demo-2",
    title: "Settlement Completed",
    message: "You paid Priya Sharma INR 1,200 via UPI.",
    is_read: true,
  },
  {
    id: "demo-3",
    title: "You were added to Flat Expenses",
    message: "Aman added you to Flat Expenses. Start adding shared bills.",
    is_read: false,
  },
];

export default function NotificationsPage() {
  const q = useNotificationsQuery();
  const markReadMut = useMarkNotificationReadMutation();
  const notifications = q.data && q.data.length > 0 ? q.data : DEMO_NOTIFICATIONS;

  return (
    <div className="flex flex-1 justify-center px-4 py-6 space-y-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">Notifications</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Stay updated with your group activities and settlements.</p>
        </div>

        {/* Notifications List */}
        {q.isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {!q.data?.length && (
              <p className="text-sm text-[#64748b] dark:text-[#57737A]">
                Showing demo notifications. Real notifications will appear once API data is available.
              </p>
            )}
            {notifications.map((n) => (
              <Card key={n.id} className={`p-5 transition-all duration-300 hover:shadow-lg ${!n.is_read ? 'border-l-4 border-l-[#6366f1] dark:border-l-[#C9BFFF] bg-gradient-to-r from-[#6366f1]/5 to-transparent dark:from-[#C9BFFF]/5' : 'opacity-75'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !n.is_read 
                      ? 'bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 text-[#6366f1] dark:text-[#C9BFFF]' 
                      : 'bg-[#64748b]/10 dark:bg-[#57737A]/10 text-[#64748b] dark:text-[#57737A]'
                  }`}>
                    <Mail size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-base font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{n.title}</h3>
                      {!n.is_read && (
                        <span className="px-3 py-1 rounded-full bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 text-[#6366f1] dark:text-[#C9BFFF] text-xs font-semibold whitespace-nowrap">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#64748b] dark:text-[#57737A] mb-3">{n.message}</p>
                    {!n.is_read && q.data?.length ? (
                      <Button
                        variant="secondary"
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
                        className="px-4 py-2 text-sm"
                      >
                        <Check size={14} className="mr-1" />
                        Mark as read
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

