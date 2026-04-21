"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WalletTransaction = {
  id: string;
  recipient: string;
  amountInInr: number;
  createdAt: string;
  status: "success";
};

export type WalletCurrency = "INR" | "USD" | "EUR" | "GBP";

export const CURRENCY_RATES: Record<WalletCurrency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

export const CURRENCY_SYMBOL: Record<WalletCurrency, string> = {
  INR: "INR",
  USD: "$",
  EUR: "EUR",
  GBP: "GBP",
};

export const convertFromInr = (amountInInr: number, currency: WalletCurrency) =>
  Number((amountInInr * CURRENCY_RATES[currency]).toFixed(2));

type WalletState = {
  balanceInInr: number;
  currency: WalletCurrency;
  transactions: WalletTransaction[];
  setCurrency: (currency: WalletCurrency) => void;
  transferMoney: (recipient: string, amount: number) => { ok: boolean; message: string };
};

const storage =
  typeof window === "undefined"
    ? undefined
    : createJSONStorage(() => window.localStorage);

const initialTransactions: WalletTransaction[] = [
  {
    id: "tx-1",
    recipient: "Rahul Singh",
    amountInInr: 850,
    createdAt: "2026-04-20T10:30:00.000Z",
    status: "success",
  },
  {
    id: "tx-2",
    recipient: "Priya Sharma",
    amountInInr: 1200,
    createdAt: "2026-04-19T18:15:00.000Z",
    status: "success",
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balanceInInr: 12500,
      currency: "INR",
      transactions: initialTransactions,
      setCurrency: (currency) => set({ currency }),
      transferMoney: (recipient, amount) => {
        const normalizedRecipient = recipient.trim();
        if (!normalizedRecipient) {
          return { ok: false, message: "Recipient is required." };
        }
        if (!Number.isFinite(amount) || amount <= 0) {
          return { ok: false, message: "Enter a valid amount." };
        }
        const amountInInr = Number(amount.toFixed(2));
        if (amountInInr > get().balanceInInr) {
          return { ok: false, message: "Insufficient wallet balance." };
        }

        const tx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          recipient: normalizedRecipient,
          amountInInr,
          createdAt: new Date().toISOString(),
          status: "success",
        };

        set((state) => ({
          balanceInInr: Number((state.balanceInInr - amountInInr).toFixed(2)),
          transactions: [tx, ...state.transactions],
        }));

        return { ok: true, message: `Transferred INR ${amountInInr.toLocaleString()} to ${normalizedRecipient}.` };
      },
    }),
    {
      name: "splitex.wallet",
      storage,
      partialize: (state) => ({
        balanceInInr: state.balanceInInr,
        currency: state.currency,
        transactions: state.transactions,
      }),
    }
  )
);
