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
  category: string;        
  sort?: ServerSort;       
  page?: number;           
  signal?: AbortSignal;    
}

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
