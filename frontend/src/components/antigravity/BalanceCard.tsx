"use client";
import React from "react";
import { Card } from "./Card";

interface BalanceCardProps {
  name: string;
  amount: number;
  type: "owe" | "owed";
}

export const BalanceCard = ({ name, amount, type }: BalanceCardProps) => {
  const isOwe = type === "owe";
  const colorClass = isOwe ? "text-red-400" : "text-green-400";
  const glowClass = isOwe ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" : "drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]";

  return (
    <Card className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#e2e8f0] dark:bg-[#57737A]/20 flex items-center justify-center font-bold text-[#0f172a] dark:text-[#C2FCF7]">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[#475569] dark:text-[#85BDBF] text-sm">{isOwe ? "You owe" : "Owes you"}</p>
          <p className="font-semibold text-[#0f172a] dark:text-[#C2FCF7] text-lg">{name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-2xl ${colorClass} ${glowClass}`}>₹{amount.toLocaleString()}</p>
      </div>
    </Card>
  );
};
