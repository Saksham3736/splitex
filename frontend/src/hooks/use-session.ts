"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";
import { getMe } from "@/services/auth";

export function useSession() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (!token) return;
    if (!meQuery.data) return;
    if (user && meQuery.data.id === user.id) return;
    setSession({ token, user: meQuery.data });
  }, [meQuery.data, setSession, token, user]);

  useEffect(() => {
    if (!meQuery.isError) return;
    clearSession();
  }, [clearSession, meQuery.isError]);

  return { token, user, meQuery };
}

