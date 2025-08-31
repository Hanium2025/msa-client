// hooks/useCategoryProducts.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getProductsByCategory,
  type CategoryProductDTO,
  type ServerSort,
} from "../lib/api/category";

/** UI에서 쓰는 정렬 값 */
export type UiSort = "new" | "popular";

/** UI → 서버 정렬 매핑 */
const uiToServerSort = (s: UiSort): ServerSort => (s === "popular" ? "like" : "recent");

/** 화면 컴포넌트에 넘길 아이템 형태 */
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

  // slug는 이미 서버 enum과 동일
  const category = useMemo(
    () => (slug as ServerCategoryKey) ?? ("OTHER" as const),
    [slug]
  );

  // 진행 중 요청 취소용
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

        // 서버 기본 1페이지당 20개
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

  // 카테고리/정렬이 바뀌면 0페이지부터 새로 불러오기
  useEffect(() => {
    setRefreshing(true);
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // 상태 & 액션
    sort,               // 'new' | 'popular'
    setSort,            // 정렬 변경 시 자동 refetch
    items,              // ProductGrid에 그대로 전달
    loading,
    refreshing,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
