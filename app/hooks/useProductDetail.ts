// hooks/useProductDetail.ts
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type ApiImage = {
  productImageId: number;
  imageUrl: string;
};

export type ApiProduct = {
  productId: number;
  sellerId: number;
  title: string;
  content: string;
  price: number | string;
  category: string; // "ELECTRONICS" 등
  status: "SELLING" | "IN_PROGRESS" | "SOLD_OUT";
  images: ApiImage[];
};

type ApiOk = { code: 200; message: string; data: ApiProduct };
type ApiNotFound = { code: 404; message: string };
type ApiResponse = ApiOk | ApiNotFound;

// NOTE: 네 프로젝트에 맞춰 EXPO_PUBLIC_API_URL 사용
const API = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export const useProductDetail = (productId: number, token?: string) => {
  return useQuery<ApiProduct, Error>({
    queryKey: ["productDetail", productId],
    enabled: !!token && Number.isFinite(productId) && productId > 0, // 토큰/ID 있어야 호출
    staleTime: 60_000, // 1분
    retry: (failureCount, error) => {
      // 404는 재시도 의미 없으니 중단
      if (error?.message?.includes("찾을 수 없습니다")) return false;
      return failureCount < 2;
    },
    queryFn: async () => {
      try {
        const res = await axios.get<ApiResponse>(`${API}/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // HTTP 200이라도 body.code가 404일 수 있음
        if ("code" in res.data && res.data.code === 404) {
          throw new Error(res.data.message || "해당하는 상품을 찾을 수 없습니다.");
        }
        if (!("data" in res.data)) {
          throw new Error("서버 응답 형식이 올바르지 않습니다.");
        }
        return res.data.data;
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const ax = e as AxiosError<ApiNotFound>;
          if (ax.response?.status === 404 || ax.response?.data?.code === 404) {
            throw new Error(ax.response?.data?.message || "해당하는 상품을 찾을 수 없습니다.");
          }
          throw new Error(ax.message || "상품 조회 중 오류가 발생했습니다.");
        }
        throw e as Error;
      }
    },
  });
};
