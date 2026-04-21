"use client";

import { Button } from "@/components/antigravity/Button";
import { Card } from "@/components/antigravity/Card";
import { useAuthStore } from "@/store/auth-store";
import { User, Mail, LogOut } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const displayUser = user ?? {
    name: "Saksham Verma",
    email: "saksham@splitex.demo",
  };

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">Profile</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Manage your account settings and preferences.</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#C9BFFF] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#C2FCF7] mb-1">{displayUser.name}</h2>
            <p className="text-[#64748b] dark:text-[#57737A]">{displayUser.email}</p>
            {!user && (
              <p className="text-xs text-[#64748b] dark:text-[#57737A] mt-2">
                Demo profile shown until login data is available.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafc] dark:bg-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30">
              <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 flex items-center justify-center text-[#6366f1] dark:text-[#C9BFFF]">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-base font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{displayUser.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f8fafc] dark:bg-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30">
              <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 flex items-center justify-center text-[#6366f1] dark:text-[#C9BFFF]">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-base font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{displayUser.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e2e8f0] dark:border-[#57737A]/30">
            <Button 
              variant="danger" 
              onClick={() => clearSession()}
              className="w-full gap-2 py-3 text-base"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

