import { useCallback, useState } from "react";
import {
  submitTradeReview,
  SubmitTradeReviewRequest,
  ApiResponse,
} from "../lib/api/trade";

type UseTradeReviewReturn = {
  submit: (
    tradeId: number | string,
    payload: SubmitTradeReviewRequest
  ) => Promise<ApiResponse | undefined>;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  reset: () => void;
};

export function useTradeReview(): UseTradeReviewReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const submit = useCallback(
    async (tradeId: number | string, payload: SubmitTradeReviewRequest) => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const res = await submitTradeReview(tradeId, payload); // 전역 토큰 자동 적용
        setSuccessMessage(res.message ?? "거래 평가가 완료되었습니다.");
        return res;
      } catch (e: any) {
        setError(e?.message ?? "리뷰 등록 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { submit, loading, error, successMessage, reset };
}
