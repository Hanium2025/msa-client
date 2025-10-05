import { useQuery, QueryKey } from "@tanstack/react-query";
import { ProductApiItem } from "../lib/api/profile";

type FetchTradeItemsFunction = () => Promise<ProductApiItem[]>;

export function useMyTradeItems(
  queryKey: QueryKey,
  queryFn: FetchTradeItemsFunction
) {
  const { 
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ProductApiItem[], Error>({ 
    queryKey: queryKey,
    queryFn: queryFn,
  });

  return { 
    items: data ?? [], 
    isLoading, 
    isError, 
    error 
  };
}