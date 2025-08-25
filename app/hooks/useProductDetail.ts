// hooks/useProductDetail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

type ApiImage = {
  productImageId: number;
  imageUrl: string;
};

// 서버 응답 원형(서버에서 내려오는 그대로의 타입)
type ServerProduct = {
  productId: number;
  sellerId: number;
  sellerNickname?: string;
  title: string;
  content: string;
  price: number | string;
  category: string;              // 서버는 "IT, 전자제품" 같은 한글 라벨
  status: string;                // 서버는 "판매 중" 등 한글
  seller?: boolean;              // 내가 판매자인지 여부
  liked?: boolean;               // 내가 찜했는지 여부
  likeCount?: number;            // (있으면 사용, 없으면 프론트 기본값)
  images: ApiImage[];
};

// 앱에서 쓰기 편하게 정규화한 타입
export type ApiProduct = {
  productId: number;
  sellerId: number;
  sellerNickname?: string;
  title: string;
  content: string;
  price: number | string;
  category: string;              // 그대로 사용(한글 라벨)
  status: "SELLING" | "IN_PROGRESS" | "SOLD_OUT";  // 정규화
  seller: boolean;               // 기본 false
  liked: boolean;                // 기본 false
  likeCount: number;             // 기본 0
  images: ApiImage[];
};

type ApiOk = { code: 200; message: string; data: ServerProduct };
type ApiNotFound = { code: 404; message: string };
type ApiResponse = ApiOk | ApiNotFound;

// 서버 한글 상태 → 프런트 enum 매핑
const STATUS_MAP: Record<string, ApiProduct["status"]> = {
  "판매 중": "SELLING",
  "거래 중": "IN_PROGRESS",
  "판매 완료": "SOLD_OUT",
};

function normalize(server: ServerProduct): ApiProduct {
  const status =
    STATUS_MAP[server.status] ?? "SELLING"; // 안전 기본값

  return {
    productId: server.productId,
    sellerId: server.sellerId,
    sellerNickname: server.sellerNickname,
    title: server.title,
    content: server.content,
    price: server.price,
    category: server.category,
    status,
    seller: !!server.seller,
    liked: !!server.liked,
    likeCount: typeof server.likeCount === "number" ? server.likeCount : 0,
    images: Array.isArray(server.images) ? server.images : [],
  };
}

async function fetchProductDetail(productId: number): Promise<ApiProduct> {
  const { data } = await api.get<ApiResponse>(`/product/${productId}`);

  if ("code" in data && data.code === 404) {
    throw new Error(data.message || "해당하는 상품을 찾을 수 없습니다.");
  }
  if (!("data" in data)) {
    throw new Error("서버 응답 형식이 올바르지 않습니다.");
  }
  return normalize(data.data);
}

export const useProductDetail = (productId: number) =>
  useQuery<ApiProduct, Error>({
    queryKey: ["productDetail", productId],
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 60_000,
    retry: (failures, err) => {
      if (err.message.includes("찾을 수 없습니다")) return false;
      return failures < 2;
    },
    queryFn: () => fetchProductDetail(productId),
  });
