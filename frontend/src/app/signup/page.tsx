"use client";
import LoginPage from "../login/page";

// Re-use the unified auth page for the signup route as well
export default function SignupPage() {
  return <LoginPage />;
}
