// hooks/useProductDetail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAccessToken } from "./useAccessToken";

type ApiImage = { productImageId: number; imageUrl: string };

type ServerProduct = {
  productId: number;
  sellerId: number;
  sellerNickname?: string;
  sellerImageUrl?: string;
  createdAt?: string;
  title: string;
  content: string;
  price: number | string;
  category: string;
  status: string; // "판매 중" | "예약 중" | "판매 완료"
  seller?: boolean;
  liked?: boolean;
  likeCount?: number;
  images: ApiImage[];
};

// 프론트에서 사용하는 표준 타입
export type ApiProduct = {
  productId: number;
  sellerId: number;
  sellerNickname?: string;
  sellerImageUrl?: string;
  createdAt?: string;
  title: string;
  content: string;
  price: number; // 숫자로 정규화
  category: string;
  status: "SELLING" | "IN_PROGRESS" | "SOLD_OUT"; // 로직 분기용
  statusLabel: string; 
  seller: boolean;
  liked: boolean;
  likeCount: number;
  images: ApiImage[];
};

type ApiOk = { code: 200; message: string; data: ServerProduct };
type ApiNotFound = { code: 404; message: string };
type ApiResponse = ApiOk | ApiNotFound;

// "예약 중" / "예약중" / "거래 중" 등 허용
function normalizeStatusToCode(raw?: string): ApiProduct["status"] {
  const s = (raw ?? "").replace(/\s/g, "");
  // 서버가 "거래 중"으로 내려올 가능성도 고려
  if (s === "판매중") return "SELLING";
  if (s === "예약중" || s === "거래중") return "IN_PROGRESS";
  if (s === "판매완료" || s === "거래완료") return "SOLD_OUT";
  // 모르면 일단 판매중 처리
  return "SELLING";
}

function statusCodeToLabel(code: ApiProduct["status"]): string {
  switch (code) {
    case "SELLING":
      return "판매 중";
    case "IN_PROGRESS":
      return "예약 중"; 
    case "SOLD_OUT":
      return "거래 완료"; 
  }
}

function normalizePrice(p: number | string): number {
  if (typeof p === "number") return p;
  const n = Number(String(p).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normalize(server: ServerProduct): ApiProduct {
  const status = normalizeStatusToCode(server.status);
  return {
    productId: server.productId,
    sellerId: server.sellerId,
    sellerNickname: server.sellerNickname,
    sellerImageUrl: server.sellerImageUrl,
    createdAt: server.createdAt,
    title: server.title,
    content: server.content,
    price: normalizePrice(server.price),
    category: server.category,
    status,
    statusLabel: statusCodeToLabel(status),
    seller: !!server.seller,
    liked: !!server.liked,
    likeCount: typeof server.likeCount === "number" ? server.likeCount : 0,
    images: Array.isArray(server.images) ? server.images : [],
  };
}

async function fetchProductDetail(productId: number, token: string): Promise<ApiProduct> {
  const { data } = await api.get<ApiResponse>(`/product/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  if ("code" in data && data.code === 404) {
    throw new Error(data.message || "해당하는 상품을 찾을 수 없습니다.");
  }
  if (!("data" in data)) {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }
  return normalize(data.data);
}

export const useProductDetail = (productId: number, passedToken?: string) => {
  const { getAccessToken } = useAccessToken();

  return useQuery<ApiProduct, Error>({
    queryKey: ["productDetail", productId, Boolean(passedToken)],
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 60_000,
    retry: (failures, err) => {
      const m = err?.message ?? "";
      if (m.includes("찾을 수 없습니다") || m.includes("로그인") || m.includes("401")) return false;
      return failures < 2;
    },
    queryFn: async () => {
      const token = passedToken || (await getAccessToken());
      if (!token) throw new Error("로그인이 필요합니다. (토큰 없음)");
      return fetchProductDetail(productId, token);
    },
  });
};
