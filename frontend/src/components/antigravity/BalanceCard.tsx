"use client";
import React from "react";
import { Card } from "./Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface BalanceCardProps {
  name: string;
  amount: number;
  type: "owe" | "owed";
}

export const BalanceCard = ({ name, amount, type }: BalanceCardProps) => {
  const isOwe = type === "owe";
  const colorClass = isOwe ? "text-red-500" : "text-green-500";
  const bgColorClass = isOwe ? "from-red-500/10 to-red-600/5" : "from-green-500/10 to-green-600/5";
  const iconBgClass = isOwe ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500";
  const glowClass = isOwe ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]";

  return (
    <Card className="flex items-center justify-between p-5 group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${bgColorClass} rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBgClass} flex items-center justify-center font-bold text-lg shadow-md`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[#64748b] dark:text-[#57737A] text-xs font-medium uppercase tracking-wider mb-1">{isOwe ? "You owe" : "Owes you"}</p>
          <p className="font-semibold text-[#0f172a] dark:text-[#C2FCF7] text-lg">{name}</p>
        </div>
      </div>
      <div className="text-right relative z-10">
        <p className={`font-bold text-2xl ${colorClass} ${glowClass}`}>₹{amount.toLocaleString()}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          {isOwe ? (
            <ArrowUpRight size={14} className="text-red-500" />
          ) : (
            <ArrowDownRight size={14} className="text-green-500" />
          )}
          <span className="text-xs text-[#64748b] dark:text-[#57737A]">{isOwe ? "Pay" : "Receive"}</span>
        </div>
      </div>
    </Card>
  );
};
