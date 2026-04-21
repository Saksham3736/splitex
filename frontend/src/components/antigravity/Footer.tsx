import React from "react";
import Image from "next/image";

export const Footer = () => (
  <footer className="bg-[#ffffff] dark:bg-[#040F0F] border-t border-[#e2e8f0] dark:border-[#57737A]/30 py-6 mt-auto">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2">
        <div className="relative w-24 h-6 mb-2">
          <Image src="/logo.png" alt="SplitEX Logo" fill className="object-contain object-left" />
        </div>
        <p className="text-[#475569] dark:text-[#85BDBF] text-xs leading-relaxed max-w-xs">
          Smart expense splitting with groups, live balances, and optimized settlements.
        </p>
      </div>
      <div>
        <h4 className="text-[#6366f1] dark:text-[#C9BFFF] text-sm font-semibold mb-3">Company</h4>
        <ul className="space-y-1.5 text-xs text-[#64748b] dark:text-[#57737A]">
          <li><a href="#" className="hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors">Careers</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[#6366f1] dark:text-[#C9BFFF] text-sm font-semibold mb-3">Resources</h4>
        <ul className="space-y-1.5 text-xs text-[#64748b] dark:text-[#57737A]">
          <li><a href="#" className="hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors">Help Center</a></li>
          <li><a href="#" className="hover:text-[#0f172a] dark:hover:text-[#C2FCF7] transition-colors">Community</a></li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 mt-6 pt-4 border-t border-[#e2e8f0] dark:border-[#57737A]/20 text-center text-xs text-[#64748b] dark:text-[#57737A]">
      © {new Date().getFullYear()} SplitEX. All rights reserved.
    </div>
  </footer>
);
