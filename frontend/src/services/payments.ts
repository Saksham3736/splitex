import { apiFetch } from "@/lib/api";
import type { UpiLinkResponse } from "@/types/api";

export type GenerateUpiLinkRequest = {
  amount: number;
  receiverUpi: string;
  name: string;
};

export async function generateUpiLink(req: GenerateUpiLinkRequest) {
  return apiFetch<UpiLinkResponse>("/payments/upi-link", {
    method: "POST",
    json: req,
  });
}

