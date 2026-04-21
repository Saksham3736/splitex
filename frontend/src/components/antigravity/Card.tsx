"use client";
import React from "react";
import { BoneyardHover } from "./Boneyard";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <BoneyardHover className={`bg-[#f1f5f9] dark:bg-[#57737A]/10 backdrop-blur-xl border border-[#cbd5e1] dark:border-[#57737A]/40 rounded-xl p-6 hover:border-[#C2FCF7]/60 hover:shadow-[0_0_20px_rgba(194,252,247,0.15)] transition-all duration-300 ${className || ""}`}>
      {children}
    </BoneyardHover>
  );
};
