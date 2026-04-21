"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { Users, Plus } from "lucide-react";
import Link from "next/link";

export default function GroupsPage() {
  const groups = [
    { id: "1", name: "Goa Trip 2026", members: 5, balance: -3050 },
    { id: "2", name: "Apartment Rent", members: 3, balance: 1200 },
    { id: "3", name: "Weekend Party", members: 8, balance: 0 },
  ];

  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Groups</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Manage your shared expenses.</p>
        </div>
        <Button variant="primary" className="gap-2"><Plus size={18} /> Create Group</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => (
          <Link href={`/app/groups/${g.id}`} key={g.id}>
            <Card className="h-full flex flex-col justify-between group cursor-pointer hover:bg-[#e2e8f0] dark:bg-[#57737A]/20 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#0f172a] dark:text-[#C2FCF7] group-hover:text-[#6366f1] dark:text-[#C9BFFF] transition-colors">{g.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-[#475569] dark:text-[#85BDBF] bg-[#cbd5e1] dark:bg-[#57737A]/30 px-2 py-1 rounded-full">
                    <Users size={12} /> {g.members}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#e2e8f0] dark:border-[#57737A]/30 flex justify-between items-center">
                <span className="text-sm text-[#64748b] dark:text-[#57737A]">Your Balance</span>
                <span className={`font-bold ${g.balance < 0 ? 'text-red-400' : g.balance > 0 ? 'text-green-400' : 'text-[#475569] dark:text-[#85BDBF]'}`}>
                  {g.balance < 0 ? `You owe ₹${Math.abs(g.balance)}` : g.balance > 0 ? `Owes you ₹${g.balance}` : 'Settled up'}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </BoneyardTransition>
  );
}
