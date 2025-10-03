// hooks/useConfirmPayment.ts
import { useMutation } from "@tanstack/react-query";
import {
  confirmPayment,
  ConfirmPayload,
  ConfirmResponse,
} from "../lib/api/payment";
import { useAccessToken } from "./useAccessToken";

const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_BASE;

export const getChatroomIdFromConfirm = (res: ConfirmResponse) =>
  (res as any).chatroomId ?? (res as any).data?.chatroomId;

export function useConfirmPayment(opts?: { baseUrl?: string }) {
  const baseUrl = opts?.baseUrl ?? DEFAULT_BASE;
  const { getAccessToken } = useAccessToken();

  return useMutation<ConfirmResponse, Error, ConfirmPayload>({
    mutationKey: ["payment", "confirm"],
    // 승인 API는 재시도하면 문제가 될 수 있으니 기본 비활성화
    retry: false,
    mutationFn: async (payload) => {
      const token = await getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다. (토큰 없음)");

      if (!payload?.orderId) throw new Error("orderId가 없습니다.");
      if (!payload?.paymentKey) throw new Error("paymentKey가 없습니다.");

      const amount = Number(payload?.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("amount가 올바르지 않습니다.");
      }

      return confirmPayment({
        payload: { ...payload, amount }, // 숫자 보장
        token,
        baseUrl,
      });
    },
  });
}
