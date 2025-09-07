import { api } from "../api";

export type ServerSort = "recent" | "like";

export interface SearchProductDTO {
  productId: number;
  title: string;
  price: number;
  imageUrl?: string | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface FetchSearchParams {
  keyword: string;
  sort?: ServerSort;
  page?: number;
  signal?: AbortSignal;
}


export async function getProductsByKeywordList({
  keyword,
  sort = "recent",
  page = 0,
  signal,
}: FetchSearchParams): Promise<SearchProductDTO[]> {
  const url = `/product/search/${encodeURIComponent(keyword)}`;
  const res = await api.get<ApiResponse<{ productList: SearchProductDTO[] }>>(url, {
    params: { sort, page },
    signal,
  });
  return res.data.data.productList;
}

export interface ApiOk {
  code: number;
  message: string;
}

export interface SearchHistoryItem {
  searchId: number;
  keyword: string;
}

/** GET /search-history */
export async function getSearchHistory(signal?: AbortSignal): Promise<SearchHistoryItem[]> {
  const res = await api.get<ApiResponse<SearchHistoryItem[]>>("/product/search-history", { signal });
  return res.data.data;
}

/** DELETE /search-history/{searchId} */
export async function deleteSearchHistory(searchId: number, signal?: AbortSignal): Promise<ApiOk> {
  const res = await api.delete<ApiOk>(`/product/search-history/${searchId}`, { signal });
  return res.data;
}

/** DELETE /search-history (전체 삭제) */
export async function clearSearchHistory(signal?: AbortSignal): Promise<ApiOk> {
  const res = await api.delete<ApiOk>("/product/search-history", { signal });
  return res.data;
}