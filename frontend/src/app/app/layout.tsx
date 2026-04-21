import React from "react";
import { Sidebar } from "@/components/antigravity/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row bg-[#ffffff] dark:bg-[#040F0F]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
