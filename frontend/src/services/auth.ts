import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/store/auth-store";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: Pick<AuthUser, "id" | "name">;
};

export async function login(req: LoginRequest) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    json: req,
  });
}

export async function signup(req: SignupRequest) {
  return apiFetch<unknown>("/auth/signup", {
    method: "POST",
    json: req,
  });
}

export async function getMe() {
  return apiFetch<AuthUser>("/auth/me", { method: "GET" });
}

