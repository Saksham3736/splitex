"use client";
import React from "react";
import { BoneyardHover } from "./Boneyard";

interface ExpenseItemProps {
  description: string;
  paidBy: string;
  amount: number;
  date: string;
}

export const ExpenseItem = ({ description, paidBy, amount, date }: ExpenseItemProps) => {
  return (
    <BoneyardHover className="flex items-center justify-between p-4 bg-[#f8fafc] dark:bg-[#57737A]/5 border-b border-[#e2e8f0] dark:border-[#57737A]/20 last:border-b-0 hover:bg-[#f1f5f9] dark:bg-[#57737A]/10 transition-colors rounded-lg mb-2">
      <div className="flex flex-col">
        <span className="font-semibold text-[#0f172a] dark:text-[#C2FCF7]">{description}</span>
        <span className="text-xs text-[#475569] dark:text-[#85BDBF] mt-1">{paidBy} paid on {date}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-[#6366f1] dark:text-[#C9BFFF]">₹{amount.toLocaleString()}</span>
      </div>
    </BoneyardHover>
  );
};
