import { api } from "../api";

export type SubmitTradeReviewRequest = {
  rating: number;
  comment: string;
};

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

export async function submitTradeReview(
  tradeId: number | string,
  payload: SubmitTradeReviewRequest
): Promise<ApiResponse> {
  // 여기서 Authorization 헤더는 전역 axios(api)에서 이미 세팅됨
  const res = await api.post<ApiResponse>(`/trade/review/${tradeId}`, payload);
  return res.data;
}
