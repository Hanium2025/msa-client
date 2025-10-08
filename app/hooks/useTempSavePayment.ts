// app/hooks/useTempSavePayment.ts
import { useMutation } from "@tanstack/react-query";
import { tempSavePayment, TempSavePayload, TempSaveResponse } from "../lib/api/payment";
import { useAccessToken } from "./useAccessToken";

const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_BASE;

export function useTempSavePayment(opts?: { baseUrl?: string }) {
  const baseUrl = opts?.baseUrl ?? DEFAULT_BASE;
  const { getAccessToken } = useAccessToken();

  return useMutation<TempSaveResponse, Error, TempSavePayload>({
    mutationFn: async (payload) => {
      const token = await getAccessToken();
      console.log("[hook:temp-save] token?", !!token, "baseUrl:", baseUrl, "payload:", payload);
      if (!token) throw new Error("로그인이 필요합니다. (토큰 없음)");
      const res = await tempSavePayment({ payload, token, baseUrl });
      console.log("[hook:temp-save] done:", res);
      return res;
    },
  });
}
