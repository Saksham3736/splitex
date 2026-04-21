"use client";
import React from "react";
import { BoneyardHover } from "./Boneyard";
import { Receipt, Calendar } from "lucide-react";

interface ExpenseItemProps {
  description: string;
  paidBy: string;
  amount: number;
  date: string;
}

export const ExpenseItem = ({ description, paidBy, amount, date }: ExpenseItemProps) => {
  return (
    <BoneyardHover className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] dark:from-[#57737A]/5 dark:to-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/20 hover:border-[#6366f1]/30 dark:hover:border-[#C9BFFF]/30 hover:shadow-md transition-all duration-300 rounded-xl group cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 dark:bg-[#C9BFFF]/10 flex items-center justify-center text-[#6366f1] dark:text-[#C9BFFF] group-hover:scale-110 transition-transform">
          <Receipt size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7] text-base group-hover:text-[#6366f1] dark:group-hover:text-[#C9BFFF] transition-colors">{description}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#64748b] dark:text-[#57737A]">{paidBy} paid</span>
            <div className="flex items-center gap-1 text-xs text-[#64748b] dark:text-[#57737A]">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="font-bold text-xl text-[#6366f1] dark:text-[#C9BFFF] group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all">₹{amount.toLocaleString()}</span>
      </div>
    </BoneyardHover>
  );
};
