import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchFavorites, FavoriteItem } from "../lib/api/favorites";

const PAGE_SIZE = 20;

export function useFavorites() {
  const query = useInfiniteQuery<FavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: ({ pageParam = 0 }) => fetchFavorites(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  const items = useMemo(
    () => (query.data?.pages ?? []).flat(),
    [query.data?.pages]
  );

  return {
    items,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
  };
}