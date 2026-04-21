"use client";
import React, { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { ArrowRight, X, SmartphoneNfc } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SettlementCardProps {
  from: string;
  to: string;
  amount: number;
  isCurrentUserPayer: boolean;
}

export const SettlementCard = ({ from, to, amount, isCurrentUserPayer }: SettlementCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#e2e8f0] dark:bg-[#57737A]/20 border border-[#cbd5e1] dark:border-[#C2FCF7]/30 flex items-center justify-center font-bold text-[#0f172a] dark:text-[#C2FCF7] text-lg shadow-[0_0_10px_rgba(194,252,247,0.1)]">
              {from.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[#475569] dark:text-[#85BDBF] mt-2">{from}</span>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <span className="font-bold text-xl text-[#6366f1] dark:text-[#C9BFFF] mb-1">₹{amount.toLocaleString()}</span>
            <ArrowRight className="text-[#64748b] dark:text-[#57737A]" />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#e0e7ff] dark:bg-[#C9BFFF]/20 border border-[#a5b4fc] dark:border-[#C9BFFF]/50 flex items-center justify-center font-bold text-[#6366f1] dark:text-[#C9BFFF] text-lg shadow-[0_0_15px_rgba(201,191,255,0.2)]">
              {to.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[#475569] dark:text-[#85BDBF] mt-2">{to}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          {isCurrentUserPayer ? (
            <Button variant="primary" className="w-full" onClick={() => setShowModal(true)}>Settle via UPI</Button>
          ) : (
            <Button variant="secondary" className="w-full">Mark as Paid</Button>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#ffffff] dark:bg-[#040F0F] border border-[#e2e8f0] dark:border-[#57737A]/50 rounded-2xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-[#64748b] dark:text-[#57737A] hover:text-[#0f172a] dark:hover:text-[#C2FCF7]"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6 pt-4">
                <div className="w-16 h-16 mx-auto bg-[#e0e7ff] dark:bg-[#C2FCF7]/10 text-[#6366f1] dark:text-[#C2FCF7] rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(194,252,247,0.3)]">
                  <SmartphoneNfc size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] dark:text-[#C2FCF7]">Pay {to}</h3>
                <p className="text-3xl font-extrabold text-[#6366f1] dark:text-[#C9BFFF] mt-2">₹{amount.toLocaleString()}</p>
                <p className="text-sm text-[#475569] dark:text-[#85BDBF] mt-2 font-mono bg-[#f1f5f9] dark:bg-[#57737A]/20 py-1 px-2 rounded inline-block">UPI ID: {to.toLowerCase().replace(' ', '')}@okaxis</p>
              </div>

              <div className="space-y-3">
                <Button variant="primary" className="w-full py-3 shadow-[0_0_15px_rgba(201,191,255,0.4)]" onClick={() => { alert('Opening Google Pay...'); setShowModal(false); }}>
                  Pay with Google Pay
                </Button>
                <Button variant="secondary" className="w-full py-3" onClick={() => { alert('Opening PhonePe...'); setShowModal(false); }}>
                  Pay with PhonePe
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
