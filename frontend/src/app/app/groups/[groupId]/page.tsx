"use client";
import React, { useState } from "react";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { ExpenseItem } from "@/components/antigravity/ExpenseItem";
import { BalanceCard } from "@/components/antigravity/BalanceCard";
import { SettlementCard } from "@/components/antigravity/SettlementCard";
import { ScanModal } from "@/components/antigravity/ScanModal";
import { ScannedBillReview } from "@/components/antigravity/ScannedBillReview";
import { Users, Plus, ArrowLeft, ScanLine } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function GroupDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"expenses" | "balances" | "settlements">("expenses");

  // OCR Scan State
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  
  // Expenses State (mock data initially)
  const [expenses, setExpenses] = useState([
    { description: "Dinner at Taj", paidBy: "You", amount: 4500, date: "Today" },
    { description: "Scuba Diving", paidBy: "Rahul", amount: 12000, date: "Yesterday" },
    { description: "Drinks", paidBy: "Aman", amount: 3200, date: "Oct 12" }
  ]);

  const handleScanComplete = (data: any) => {
    setIsScanModalOpen(false);
    setScannedData(data);
    setIsReviewOpen(true);
  };

  const handleConfirmScan = (total: number, items: any[]) => {
    setIsReviewOpen(false);
    // Add the scanned bill as a new expense
    setExpenses([
      { description: "Scanned Bill", paidBy: "You", amount: total, date: "Just now" },
      ...expenses
    ]);
    setActiveTab("expenses");
  };

  return (
    <BoneyardTransition className="space-y-6 pb-20 md:pb-0">
      <Link href="/app/groups" className="inline-flex items-center gap-2 text-[#475569] dark:text-[#85BDBF] hover:text-[#0f172a] dark:text-[#C2FCF7] transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6366f1] dark:text-[#C9BFFF] mb-2">Goa Trip 2026</h1>
          <div className="flex items-center gap-3 text-sm text-[#475569] dark:text-[#85BDBF]">
            <span className="flex items-center gap-1"><Users size={14} /> 5 Members</span>
            <span>•</span>
            <span className="text-red-400">You owe ₹3,050</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="gap-2 flex-1 sm:flex-none" onClick={() => setIsScanModalOpen(true)}>
            <ScanLine size={18} /> Scan Bill
          </Button>
          <Button variant="primary" className="gap-2 flex-1 sm:flex-none">
            <Plus size={18} /> Add
          </Button>
        </div>
      </div>

      <div className="flex border-b border-[#e2e8f0] dark:border-[#57737A]/30 overflow-x-auto hide-scrollbar">
        {["expenses", "balances", "settlements"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium capitalize whitespace-nowrap transition-colors relative ${
              activeTab === tab ? "text-[#0f172a] dark:text-[#C2FCF7]" : "text-[#64748b] dark:text-[#57737A] hover:text-[#475569] dark:hover:text-[#85BDBF]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2FCF7] shadow-[0_0_8px_#C2FCF7]" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === "expenses" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="p-2">
              {expenses.map((exp, idx) => (
                <ExpenseItem key={idx} description={exp.description} paidBy={exp.paidBy} amount={exp.amount} date={exp.date} />
              ))}
            </Card>
          </motion.div>
        )}

        {activeTab === "balances" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BalanceCard name="Rahul Singh" amount={1200} type="owe" />
              <BalanceCard name="Aman Gupta" amount={1850} type="owe" />
              <BalanceCard name="Priya Sharma" amount={500} type="owed" />
            </div>
          </motion.div>
        )}

        {activeTab === "settlements" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#6366f1] dark:text-[#C9BFFF]">Optimized Transactions</h3>
              <p className="text-sm text-[#475569] dark:text-[#85BDBF]">Settle up in minimum transactions to clear all debts.</p>
            </div>
            <SettlementCard from="You" to="Rahul Singh" amount={1200} isCurrentUserPayer={true} />
            <SettlementCard from="You" to="Aman Gupta" amount={1850} isCurrentUserPayer={true} />
            <SettlementCard from="Priya Sharma" to="You" amount={500} isCurrentUserPayer={false} />
          </motion.div>
        )}
      </div>

      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)} 
        onScanComplete={handleScanComplete} 
      />

      <ScannedBillReview 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
        data={scannedData}
        onConfirm={handleConfirmScan}
      />
    </BoneyardTransition>
  );
}
