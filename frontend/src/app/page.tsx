"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Button } from "@/components/antigravity/Button";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <BoneyardTransition className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-4xl space-y-8 flex flex-col items-center">
        <div className="relative w-48 h-16 sm:w-64 sm:h-20 drop-shadow-[0_0_15px_rgba(201,191,255,0.4)]">
          <Image src="/logo.png" alt="SplitEX" fill className="object-contain" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#6366f1] dark:from-[#C9BFFF] to-[#C2FCF7]">
          Smart Expense Splitting.
        </h1>
        <p className="text-xl md:text-2xl text-[#475569] dark:text-[#85BDBF] max-w-2xl">
          Split expenses with groups, track live balances, and settle optimized transactions instantly via UPI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full sm:w-auto">
          <Link href="/app" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full px-8 py-3 text-lg font-bold">Open Dashboard</Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full px-8 py-3 text-lg">Split Smart. Pay Easy.</Button>
          </Link>
        </div>
      </div>
    </BoneyardTransition>
  );
}
