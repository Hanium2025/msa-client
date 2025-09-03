import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFavorites, FavoriteItem } from "../lib/api/favorites";

const PAGE_SIZE = 20;

export function useFavorites() {
  const query = useInfiniteQuery<FavoriteItem[]>({
    queryKey: ["favorites"],
    queryFn: ({ pageParam = 0 }) => fetchFavorites(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === PAGE_SIZE) {
        return allPages.length; // 다음 page 번호
      }
      return undefined;
    },
  });

  const flatItems = (query.data?.pages ?? []).flat();

  return {
    items: flatItems,
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
