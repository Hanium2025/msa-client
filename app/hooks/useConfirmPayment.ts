// hooks/useConfirmPayment.ts
import { useMutation } from "@tanstack/react-query";
import { confirmPayment, ConfirmPayload, ConfirmResponse } from "../lib/api/payment";
import { useAccessToken } from "./useAccessToken";

const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_BASE;

export function useConfirmPayment(opts?: { baseUrl?: string }) {
  const baseUrl = opts?.baseUrl ?? DEFAULT_BASE;
  const { getAccessToken } = useAccessToken();

  return useMutation<ConfirmResponse, Error, ConfirmPayload>({
    mutationFn: async (payload) => {
      const token = await getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다. (토큰 없음)");
      return confirmPayment({ payload, token, baseUrl });
    },
  });
}

// 응답에서 chatroomId를 안전하게 뽑아오기 위한 헬퍼
export function getChatroomIdFromConfirm(res: ConfirmResponse | any): number | undefined {
  if (!res) return;
  if (typeof res.chatroomId === "number") return res.chatroomId;
  if (res.data && typeof res.data.chatroomId === "number") return res.data.chatroomId;
}
