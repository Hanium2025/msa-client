// hooks/useCategoryProducts.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getProductsByCategory,
  type CategoryProductDTO,
  type ServerSort,
} from "../lib/api/category";

export type UiSort = "new" | "popular";

const uiToServerSort = (s: UiSort): ServerSort => (s === "popular" ? "like" : "recent");

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
};

type ServerCategoryKey =
  | "TRAVEL"
  | "FEEDING"
  | "SLEEP"
  | "PLAY"
  | "LIVING"
  | "APPAREL"
  | "OTHER";

export function useCategoryProducts(slug: string, initialSort: UiSort = "new") {
  const [sort, setSort] = useState<UiSort>(initialSort);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const category = useMemo(
    () => (slug as ServerCategoryKey) ?? ("OTHER" as const),
    [slug]
  );

  const abortRef = useRef<AbortController | null>(null);

  const mapDTO = useCallback((dto: CategoryProductDTO): ProductItem => {
    return {
      id: dto.productId,
      title: dto.title,
      price: dto.price,
      imageUrl: dto.imageUrl || "",
    };
  }, []);

  const fetchPage = useCallback(
    async (targetPage: number, replace = false) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const { data } = await getProductsByCategory({
          category,
          sort: uiToServerSort(sort),
          page: targetPage,
          signal: controller.signal,
        });

        const list = data.map(mapDTO);

        setHasMore(list.length >= 20);

        if (replace || targetPage === 0) {
          setItems(list);
          setPage(0);
        } else {
          setItems(prev => [...prev, ...list]);
          setPage(targetPage);
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "카테고리 목록을 불러오는 중 오류가 발생했어요.";
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, sort, mapDTO]
  );

  useEffect(() => {
    setRefreshing(true);
    fetchPage(0, true);
  }, [category, sort]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchPage(0, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1);
  }, [loading, hasMore, page, fetchPage]);

  return {
    sort,               
    setSort,           
    items,             
    loading,
    refreshing,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
