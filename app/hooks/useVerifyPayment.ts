// app/hooks/useVerifyPayment.ts
import { useMutation } from "@tanstack/react-query";
import { verifyPayment, VerifyPayload, VerifyResponse } from "../lib/api/payment";
import { useAccessToken } from "./useAccessToken";

const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_BASE;

export function useVerifyPayment(opts?: { baseUrl?: string }) {
  const baseUrl = opts?.baseUrl ?? DEFAULT_BASE;
  const { getAccessToken } = useAccessToken();

  return useMutation<VerifyResponse, Error, VerifyPayload>({
    mutationFn: async (payload) => {
      const token = await getAccessToken();
      console.log("[hook:verify] token?", !!token, "baseUrl:", baseUrl, "payload:", payload);
      if (!token) throw new Error("로그인이 필요합니다. (토큰 없음)");
      const res = await verifyPayment({ payload, token, baseUrl });
      console.log("[hook:verify] done:", res);
      return res;
    },
  });
}
