"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Send, Clock3 } from "lucide-react";

import { BoneyardTransition } from "@/components/antigravity/Boneyard";
import { Card } from "@/components/antigravity/Card";
import { Button } from "@/components/antigravity/Button";
import {
  CURRENCY_SYMBOL,
  convertFromInr,
  useWalletStore,
  type WalletCurrency,
} from "@/store/wallet-store";

export default function WalletPage() {
  const balanceInInr = useWalletStore((s) => s.balanceInInr);
  const currency = useWalletStore((s) => s.currency);
  const setCurrency = useWalletStore((s) => s.setCurrency);
  const transactions = useWalletStore((s) => s.transactions);
  const transferMoney = useWalletStore((s) => s.transferMoney);
  const displayBalance = convertFromInr(balanceInInr, currency);

  const [recipient, setRecipient] = useState("Aman Gupta");
  const [amount, setAmount] = useState("500");

  return (
    <BoneyardTransition className="space-y-8 pb-20 md:pb-0">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#C2FCF7] dark:from-[#C9BFFF] dark:to-[#85BDBF] bg-clip-text text-transparent mb-2">
          Wallet
        </h1>
        <p className="text-[#475569] dark:text-[#85BDBF] text-lg">
          Manage wallet balance and transfer money instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet size={24} className="text-[#6366f1] dark:text-[#C9BFFF]" />
            <p className="text-sm font-medium uppercase tracking-wider text-[#64748b] dark:text-[#57737A]">
              Current Balance
            </p>
          </div>
          <div className="mb-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as WalletCurrency)}
              className="w-full bg-[#f1f5f9] dark:bg-[#57737A]/10 border border-[#cbd5e1] dark:border-[#57737A]/40 rounded-lg py-2 px-3 text-sm text-[#0f172a] dark:text-[#C2FCF7] focus:outline-none"
            >
              <option value="INR">INR (Default)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <h2 className="text-4xl font-bold text-[#6366f1] dark:text-[#C9BFFF]">
            {CURRENCY_SYMBOL[currency]} {displayBalance.toLocaleString()}
          </h2>
          <p className="text-xs text-[#64748b] dark:text-[#57737A] mt-2">
            Demo conversion applied instantly from INR.
          </p>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="text-xl font-semibold text-[#0f172a] dark:text-[#C2FCF7] mb-4">Transfer Money</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient name"
              className="w-full bg-[#f1f5f9] dark:bg-[#57737A]/10 border border-[#cbd5e1] dark:border-[#57737A]/40 rounded-lg py-2.5 px-3 text-sm text-[#0f172a] dark:text-[#C2FCF7] focus:outline-none focus:border-[#C2FCF7]"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="1"
              placeholder="Amount"
              className="w-full bg-[#f1f5f9] dark:bg-[#57737A]/10 border border-[#cbd5e1] dark:border-[#57737A]/40 rounded-lg py-2.5 px-3 text-sm text-[#0f172a] dark:text-[#C2FCF7] focus:outline-none focus:border-[#C2FCF7]"
            />
            <Button
              variant="primary"
              className="gap-2 py-2.5"
              onClick={() => {
                const value = Number(amount);
                const result = transferMoney(recipient, value);
                if (!result.ok) {
                  toast.error(result.message);
                  return;
                }
                toast.success(result.message);
                setAmount("500");
              }}
            >
              <Send size={16} /> Transfer
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock3 size={18} className="text-[#6366f1] dark:text-[#C9BFFF]" />
          <h3 className="text-lg font-semibold text-[#0f172a] dark:text-[#C2FCF7]">Recent Transfers</h3>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 6).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] dark:bg-[#57737A]/10 border border-[#e2e8f0] dark:border-[#57737A]/30"
            >
              <div>
                <p className="font-medium text-[#0f172a] dark:text-[#C2FCF7]">To {tx.recipient}</p>
                <p className="text-xs text-[#64748b] dark:text-[#57737A]">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="font-semibold text-red-500">
                - {CURRENCY_SYMBOL[currency]} {convertFromInr(tx.amountInInr, currency).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </BoneyardTransition>
  );
}
