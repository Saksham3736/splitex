"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Bell, User, Sun, Moon } from "lucide-react";
import { Button } from "./Button";
import { useTheme } from "next-themes";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-[#ffffff]/80 dark:bg-[#040F0F]/80 backdrop-blur-lg border-b border-[#e2e8f0] dark:border-[#57737A]/30"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Mobile: small icon only, Desktop: full logo with text */}
          <div className="relative w-8 h-8 sm:hidden group-hover:drop-shadow-[0_0_8px_#C9BFFF] transition-all">
            <div className="absolute inset-0 bg-white dark:bg-[#57737A]/30 rounded-md"></div>
            <Image src="/small.logo.png" alt="SplitEX" fill className="object-contain relative z-10" />
          </div>
          <div className="relative h-8 w-32 sm:h-9 sm:w-36 hidden sm:block group-hover:drop-shadow-[0_0_8px_#C9BFFF] transition-all">
            <div className="absolute inset-0 bg-white dark:bg-[#57737A]/30 rounded-md"></div>
            <Image src="/logo.png" alt="SplitEX" fill className="object-contain object-left relative z-10" />
          </div>
        </Link>

        <div className="flex-1 max-w-sm mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#57737A]" size={16} />
            <input 
              type="text" 
              placeholder="Search groups, friends..." 
              className="w-full bg-[#f1f5f9] dark:bg-[#57737A]/10 border border-[#cbd5e1] dark:border-[#57737A]/40 rounded-full py-1.5 pl-9 pr-4 text-sm text-[#0f172a] dark:text-[#C2FCF7] focus:outline-none focus:border-[#C2FCF7] focus:shadow-[0_0_10px_rgba(194,252,247,0.2)] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-[#475569] dark:text-[#85BDBF] hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors p-1"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button className="text-[#475569] dark:text-[#85BDBF] hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors relative p-1 hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#6366f1] dark:bg-[#C9BFFF] rounded-full border border-white dark:border-[#040F0F]"></span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <Link href="/login">
              <Button variant="ghost" className="px-3 py-1.5 text-sm h-9">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="px-4 py-1.5 text-sm h-9">Sign Up</Button>
            </Link>
          </div>

          <Link href="/app/profile" className="ml-2">
            <div className="w-8 h-8 rounded-full bg-[#e2e8f0] dark:bg-[#57737A]/20 border border-[#cbd5e1] dark:border-[#C2FCF7]/30 flex items-center justify-center text-[#0f172a] dark:text-[#C2FCF7] hover:border-[#C2FCF7] transition-all cursor-pointer shadow-[0_0_10px_rgba(194,252,247,0.1)]">
              <User size={16} />
            </div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};
