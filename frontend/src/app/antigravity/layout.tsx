import React from "react";
import { Header } from "@/components/antigravity/Header";
import { Footer } from "@/components/antigravity/Footer";
import "../../globals.css";

export const metadata = {
  title: "Antigravity UI",
  description: "A futuristic SaaS dashboard",
};

export default function AntigravityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#040F0F] text-[#0f172a] dark:text-[#C2FCF7] flex flex-col font-sans selection:bg-[#C9BFFF] selection:text-[#040F0F]">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
