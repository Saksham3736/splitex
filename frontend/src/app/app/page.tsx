"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { ExpenseItem } from "@/components/antigravity/ExpenseItem";
import { BalanceCard } from "@/components/antigravity/BalanceCard";
import { ArrowUpRight, ArrowDownRight, Plus, TrendingUp, Users, Wallet } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-[#475569] dark:text-[#85BDBF] text-lg">Your financial overview across all groups.</p>
        </div>
        <Button variant="primary" className="gap-2 px-6 py-3 text-base shadow-lg"><Plus size={18} /> Add Expense</Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-6 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-400/20 to-red-500/10 text-red-500 shadow-lg relative z-10">
            <ArrowUpRight size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider mb-1">You Owe</p>
            <h2 className="text-3xl font-bold text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">₹4,250</h2>
          </div>
        </Card>
        
        <Card className="flex items-center gap-6 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400/20 to-green-500/10 text-green-500 shadow-lg relative z-10">
            <ArrowDownRight size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider mb-1">You are Owed</p>
            <h2 className="text-3xl font-bold text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">₹1,800</h2>
          </div>
        </Card>

        <Card className="flex items-center gap-6 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#C9BFFF]/10 text-[#6366f1] dark:text-[#C9BFFF] shadow-lg relative z-10">
            <Wallet size={32} />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-[#64748b] dark:text-[#57737A] font-medium uppercase tracking-wider mb-1">Net Balance</p>
            <h2 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">-₹2,450</h2>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Balances Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-[#6366f1] dark:text-[#C9BFFF]" />
              <h3 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Active Balances</h3>
            </div>
            <Link href="/app/settlements" className="text-sm text-[#6366f1] dark:text-[#C9BFFF] hover:underline font-medium">View All →</Link>
          </div>
          <div className="space-y-4">
            <BalanceCard name="Rahul Singh" amount={1200} type="owe" />
            <BalanceCard name="Aman Gupta" amount={1800} type="owed" />
            <BalanceCard name="Goa Trip" amount={3050} type="owe" />
          </div>
        </div>

        {/* Recent Expenses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#6366f1] dark:text-[#C9BFFF]" />
              <h3 className="text-xl font-semibold text-[#6366f1] dark:text-[#C9BFFF]">Recent Expenses</h3>
            </div>
          </div>
          <Card className="p-3 space-y-2">
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
