"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { ExpenseItem } from "@/components/antigravity/ExpenseItem";
import { BalanceCard } from "@/components/antigravity/BalanceCard";
import { ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Dashboard</h1>
          <p className="text-[#475569] dark:text-[#85BDBF]">Your financial overview across all groups.</p>
        </div>
        <Button variant="primary" className="gap-2"><Plus size={18} /> Add Expense</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center gap-6 p-6 border-l-4 border-l-red-400">
          <div className="p-4 rounded-full bg-red-400/10 text-red-400"><ArrowUpRight size={32} /></div>
          <div>
            <p className="text-sm text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider">You Owe</p>
            <h2 className="text-3xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]">₹4,250</h2>
          </div>
        </Card>
        
        <Card className="flex items-center gap-6 p-6 border-l-4 border-l-green-400">
          <div className="p-4 rounded-full bg-green-400/10 text-green-400"><ArrowDownRight size={32} /></div>
          <div>
            <p className="text-sm text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider">You are Owed</p>
            <h2 className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">₹1,800</h2>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Active Balances</h3>
            <Link href="/app/settlements" className="text-sm text-[#0f172a] dark:text-[#C2FCF7] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            <BalanceCard name="Rahul Singh" amount={1200} type="owe" />
            <BalanceCard name="Aman Gupta" amount={1800} type="owed" />
            <BalanceCard name="Goa Trip" amount={3050} type="owe" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Recent Expenses</h3>
          </div>
          <Card className="p-2">
            <ExpenseItem description="Dinner at Taj" paidBy="You" amount={4500} date="Today" />
            <ExpenseItem description="Uber to Airport" paidBy="Rahul" amount={800} date="Yesterday" />
            <ExpenseItem description="Airbnb Booking" paidBy="Aman" amount={12000} date="Oct 12" />
            <ExpenseItem description="Drinks" paidBy="You" amount={2400} date="Oct 11" />
          </Card>
        </div>
      </div>
    </BoneyardTransition>
  );
}
