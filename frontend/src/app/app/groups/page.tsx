"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { Users, Plus, ArrowUpRight, ArrowDownRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function GroupsPage() {
  const groups = [
    { id: "1", name: "Goa Trip 2026", members: 5, balance: -3050 },
    { id: "2", name: "Apartment Rent", members: 3, balance: 1200 },
    { id: "3", name: "Weekend Party", members: 8, balance: 0 },
  ];

  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">Groups</h1>
          <p className="text-[#475569] dark:text-[#85BDBF] text-lg">Manage your shared expenses and track balances.</p>
        </div>
        <Button variant="primary" className="gap-2 px-6 py-3 text-base shadow-lg"><Plus size={18} /> Create Group</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((g) => {
          const isOwing = g.balance < 0;
          const isOwed = g.balance > 0;
          const isSettled = g.balance === 0;
          
          return (
            <Link href={`/app/groups/${g.id}`} key={g.id}>
              <Card className="h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366f1]/5 to-[#C9BFFF]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#0f172a] dark:text-[#C2FCF7] group-hover:text-[#6366f1] dark:group-hover:text-[#C9BFFF] transition-colors">{g.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748b] dark:text-[#57737A] bg-[#f1f5f9] dark:bg-[#57737A]/30 px-3 py-1.5 rounded-full">
                      <Users size={14} /> {g.members} members
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#e2e8f0] dark:border-[#57737A]/30 relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-[#64748b] dark:text-[#57737A] uppercase tracking-wider">Your Balance</span>
                    <div className="flex items-center gap-1">
                      {isOwing && <ArrowUpRight size={16} className="text-red-500" />}
                      {isOwed && <ArrowDownRight size={16} className="text-green-500" />}
                      {isSettled && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    isOwing ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 
                    isOwed ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 
                    'text-[#64748b] dark:text-[#57737A]'
                  }`}>
                    {isOwing ? `You owe ₹${Math.abs(g.balance).toLocaleString()}` : 
                     isOwed ? `Owes you ₹${g.balance.toLocaleString()}` : 
                     'Settled up ✓'}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </BoneyardTransition>
  );
}
