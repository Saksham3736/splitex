"use client";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Button } from "@/components/antigravity/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <BoneyardTransition className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#6366f1] dark:from-[#C9BFFF] to-[#C2FCF7] drop-shadow-[0_0_15px_rgba(201,191,255,0.3)]">
          Defy Gravity.
        </h1>
        <p className="text-xl md:text-2xl text-[#475569] dark:text-[#85BDBF]">
          Experience the most fluid, modern, and physics-driven UI system for your next generation web application.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/antigravity/dashboard">
            <Button variant="primary" className="w-full sm:w-auto px-8 py-3 text-lg">Enter Dashboard</Button>
          </Link>
          <Link href="/antigravity/auth">
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-3 text-lg">Sign Up Now</Button>
          </Link>
        </div>
      </div>
    </BoneyardTransition>
  );
}
