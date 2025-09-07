// hooks/useProductDetail.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

type ApiImage = {
  productImageId: number;
  imageUrl: string;
};

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
  status: string;                
  seller?: boolean;              
  liked?: boolean;               
  likeCount?: number;            
  images: ApiImage[];
};

export type ApiProduct = {
  productId: number;
  sellerId: number;
  sellerNickname?: string;
  sellerImageUrl?: string;   
  createdAt?: string;
  title: string;
  content: string;
  price: number | string;
  category: string;              
  status: "SELLING" | "IN_PROGRESS" | "SOLD_OUT";  
  seller: boolean;               
  liked: boolean;                
  likeCount: number;             
  images: ApiImage[];
};

type ApiOk = { code: 200; message: string; data: ServerProduct };
type ApiNotFound = { code: 404; message: string };
type ApiResponse = ApiOk | ApiNotFound;

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
    sellerImageUrl: server.sellerImageUrl,  
    createdAt: server.createdAt,
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
