"use client";
import React, { useState } from "react";
import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const InputField = ({ label, type, id }: { label: string, type: string, id: string }) => (
    <div className="relative group mb-6">
      <input
        type={type}
        id={id}
        className="block w-full px-4 pt-6 pb-2 text-[#0f172a] dark:text-[#C2FCF7] bg-[#ffffff] dark:bg-[#040F0F] border border-[#cbd5e1] dark:border-[#57737A]/50 rounded-lg appearance-none focus:outline-none focus:border-[#C2FCF7] focus:shadow-[0_0_10px_rgba(194,252,247,0.2)] transition-all peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute text-[#475569] dark:text-[#85BDBF] duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#0f172a] dark:text-[#C2FCF7]"
      >
        {label}
      </label>
    </div>
  );

  return (
    <BoneyardTransition className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="relative w-40 h-12 mx-auto mb-4">
          <Image src="/logo.png" alt="SplitEX" fill className="object-contain" />
        </div>
        <p className="text-[#475569] dark:text-[#85BDBF] tracking-wide">Split smart. Pay easy.</p>
      </div>

      <Card className="w-full max-w-md !bg-[#f8fafc] dark:bg-[#57737A]/5 backdrop-blur-3xl shadow-[0_0_30px_rgba(201,191,255,0.05)] border border-[#e2e8f0] dark:border-[#57737A]/30">
        <div className="flex gap-4 mb-8">
          <button 
            className={`flex-1 pb-2 font-semibold transition-colors border-b-2 text-center ${isLogin ? "border-[#C9BFFF] text-[#6366f1] dark:text-[#C9BFFF]" : "border-transparent text-[#64748b] dark:text-[#57737A] hover:text-[#475569] dark:text-[#85BDBF]"}`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button 
            className={`flex-1 pb-2 font-semibold transition-colors border-b-2 text-center ${!isLogin ? "border-[#C9BFFF] text-[#6366f1] dark:text-[#C9BFFF]" : "border-transparent text-[#64748b] dark:text-[#57737A] hover:text-[#475569] dark:text-[#85BDBF]"}`}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>

        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isLogin && <InputField label="Full Name" type="text" id="name" />}
            <InputField label="Email Address" type="email" id="email" />
            <InputField label="Password" type="password" id="password" />
            
            <Link href="/app" className="block w-full mt-8">
              <Button variant="primary" className="w-full py-3 text-lg font-semibold tracking-wider">
                {isLogin ? "Login to SplitEX" : "Create Account"}
              </Button>
            </Link>
            
            {isLogin && (
              <p className="text-center mt-6 text-sm text-[#475569] dark:text-[#85BDBF] hover:text-[#0f172a] dark:text-[#C2FCF7] cursor-pointer transition-colors hover:drop-shadow-[0_0_5px_#C2FCF7]">
                Forgot password?
              </p>
            )}
          </form>
        </motion.div>
      </Card>
    </BoneyardTransition>
  );
}
