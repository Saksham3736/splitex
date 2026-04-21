"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, CreditCard, Bell, User, Wallet } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Groups", href: "/app/groups", icon: Users },
    { name: "Wallet", href: "/app/wallet", icon: Wallet },
    { name: "Settlements", href: "/app/settlements", icon: CreditCard },
    { name: "Notifications", href: "/app/notifications", icon: Bell },
    { name: "Profile", href: "/app/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex sticky top-20 left-0 z-40 h-[calc(100vh-80px)] w-64 bg-[#ffffff] dark:bg-[#040F0F]/95 backdrop-blur-xl border-r border-[#e2e8f0] dark:border-[#57737A]/30 p-6 flex-col gap-2"
      >
        <div className="mb-6 text-xs font-semibold text-[#64748b] dark:text-[#57737A] uppercase tracking-wider">Navigation</div>
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/app" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link key={link.name} href={link.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-[#C2FCF7]/10 text-[#0f172a] dark:text-[#C2FCF7] shadow-[inset_4px_0_0_#C2FCF7]" 
                    : "text-[#475569] dark:text-[#85BDBF] hover:bg-[#e2e8f0] dark:bg-[#57737A]/20 hover:text-[#6366f1] dark:text-[#C9BFFF]"
                }`}
              >
                <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_#C2FCF7]" : ""} />
                <span className="font-medium">{link.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff] dark:bg-[#040F0F]/95 backdrop-blur-xl border-t border-[#e2e8f0] dark:border-[#57737A]/30 flex items-center justify-around p-3 pb-safe">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/app" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link key={link.name} href={link.href} className="flex flex-col items-center gap-1">
              <div className={`p-2 rounded-full transition-colors ${isActive ? "bg-[#C2FCF7]/10 text-[#0f172a] dark:text-[#C2FCF7]" : "text-[#475569] dark:text-[#85BDBF] hover:text-[#6366f1] dark:text-[#C9BFFF]"}`}>
                <Icon size={24} className={isActive ? "drop-shadow-[0_0_8px_#C2FCF7]" : ""} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-[#0f172a] dark:text-[#C2FCF7]" : "text-[#475569] dark:text-[#85BDBF]"}`}>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
