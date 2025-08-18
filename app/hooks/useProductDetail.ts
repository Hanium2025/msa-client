// hooks/useProductDetail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api"; // ← 경로 프로젝트 구조에 맞게 조정

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

async function fetchProductDetail(productId: number): Promise<ApiProduct> {
  const { data } = await api.get<ApiResponse>(`/product/${productId}`);

  // HTTP 200이라도 body.code가 404일 수 있음
  if ("code" in data && data.code === 404) {
    throw new Error(data.message || "해당하는 상품을 찾을 수 없습니다.");
  }
  if (!("data" in data)) {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }
  return data.data;
}

export const useProductDetail = (productId: number) =>
  useQuery<ApiProduct, Error>({
    queryKey: ["productDetail", productId],
    enabled: Number.isFinite(productId) && productId > 0, // 토큰 체크 불필요(전역 인터셉터 사용)
    staleTime: 60_000,
    retry: (failures, err) => {
      if (err.message.includes("찾을 수 없습니다")) return false; // 404는 재시도 X
      return failures < 2;
    },
    queryFn: () => fetchProductDetail(productId),
  });