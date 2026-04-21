"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <div className="flex flex-1 items-start justify-center px-6 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{user?.name ?? "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user?.email ?? "—"}</p>
          </div>

          <Button variant="destructive" onClick={() => clearSession()}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

