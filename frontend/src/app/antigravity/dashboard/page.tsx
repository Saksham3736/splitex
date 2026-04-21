"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Users, DollarSign, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <BoneyardTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Overview</h1>
        <p className="text-[#475569] dark:text-[#85BDBF]">Welcome back, Commander. Here's your system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[#C9BFFF]/10 text-[#6366f1] dark:text-[#C9BFFF]"><Users size={24} /></div>
            <div>
              <p className="text-sm text-[#64748b] dark:text-[#57737A]">Total Users</p>
              <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#C2FCF7]">12,450</h2>
            </div>
          </div>
          <div className="h-1 w-full bg-[#cbd5e1] dark:bg-[#57737A]/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#C9BFFF] w-3/4"></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[#C2FCF7]/10 text-[#0f172a] dark:text-[#C2FCF7]"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-[#64748b] dark:text-[#57737A]">Revenue</p>
              <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#C2FCF7]">$84,300</h2>
            </div>
          </div>
          <div className="h-1 w-full bg-[#cbd5e1] dark:bg-[#57737A]/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#C2FCF7] w-1/2"></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[#85BDBF]/10 text-[#475569] dark:text-[#85BDBF]"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-[#64748b] dark:text-[#57737A]">System Health</p>
              <h2 className="text-2xl font-bold text-[#0f172a] dark:text-[#C2FCF7]">99.9%</h2>
            </div>
          </div>
          <div className="h-1 w-full bg-[#cbd5e1] dark:bg-[#57737A]/30 rounded-full overflow-hidden">
            <div className="h-full bg-[#85BDBF] w-[99%]"></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-[#64748b] dark:text-[#57737A] italic text-sm mb-6 uppercase tracking-widest">Performance Metrics (Boneyard Simulation)</p>
          <div className="w-full h-48 flex items-end gap-2 px-4 sm:px-8">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-[#e0e7ff] dark:from-[#C2FCF7]/20 to-[#C9BFFF]/80 rounded-t hover:brightness-125 transition-all cursor-pointer shadow-[0_0_15px_rgba(201,191,255,0.2)]" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </Card>
        
        <Card className="min-h-[300px]">
          <h3 className="text-lg font-semibold text-[#6366f1] dark:text-[#C9BFFF] mb-6">Activity Feed</h3>
          <div className="space-y-4">
            {[
              { msg: "System upgrade complete", time: "2 hours ago" },
              { msg: "New user registered", time: "4 hours ago" },
              { msg: "Database optimized", time: "5 hours ago" },
              { msg: "Security scan passed", time: "1 day ago" }
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[#e2e8f0] dark:border-[#57737A]/20 pb-3 last:border-0 hover:bg-[#f8fafc] dark:bg-[#57737A]/5 p-2 rounded transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#C2FCF7] shadow-[0_0_8px_#C2FCF7]"></div>
                <div>
                  <p className="text-sm text-[#0f172a] dark:text-[#C2FCF7]">{log.msg}</p>
                  <p className="text-xs text-[#64748b] dark:text-[#57737A]">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </BoneyardTransition>
  );
}
