// api/category.ts
import { api } from "../api";

export type ServerSort = "recent" | "like";

export interface CategoryProductDTO {
  productId: number;
  title: string;
  price: number;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface FetchCategoryParams {
  category: string;        // 서버 enum 문자열 (TRAVEL, FEEDING, ...)
  sort?: ServerSort;       // 기본: recent
  page?: number;           // 기본: 0
  signal?: AbortSignal;    // 선택: 요청 취소용
}

/**
 * 카테고리별 상품 목록 조회
 * GET /product/category/{category}?sort=recent&page=0
 */
export async function getProductsByCategory({
  category,
  sort = "recent",
  page = 0,
  signal,
}: FetchCategoryParams): Promise<ApiResponse<CategoryProductDTO[]>> {
  const url = `/product/category/${encodeURIComponent(category)}`;
  const res = await api.get<ApiResponse<CategoryProductDTO[]>>(url, {
    params: { sort, page },
    signal,
  });
  return res.data;
}
