"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  upi_id?: string | null;
  profile_image?: string | null;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (payload: { token: string; user: AuthUser }) => void;
  clearSession: () => void;
};

const storage =
  typeof window === "undefined"
    ? undefined
    : createJSONStorage(() => window.localStorage);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: "splitex.auth",
      storage,
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

