// src/hooks/useMySellItem.ts

import { useQuery } from "@tanstack/react-query";
import { getMySellItem, ProductApiItem } from "../lib/api/profile";

export function useMySellItem() {
  const { 
    data,         // API 요청이 성공했을 때의 데이터
    isLoading,    // 첫 로딩 중일 때 true
    isError,      // 요청이 실패했을 때 true
    error,        // 에러 객체
    isFetching,   // 백그라운드에서 데이터를 다시 가져올 때 true
  } = useQuery<ProductApiItem[], Error>({ // 성공 시 타입, 실패 시 타입
    
    // 이 쿼리를 식별하는 고유한 키입니다.
    // 이 키를 기반으로 데이터를 캐싱하고 관리합니다.
    queryKey: ['mySellItems'], 
    
    // 데이터를 가져오는 비동기 함수(Promise를 반환해야 함)
    queryFn: getMySellItem,
    
    // 추가 옵션 (필요에 따라 사용)
    // staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 'fresh' 상태로 유지 (refetch 방지)
    // refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
  });

  return { 
    sellItems: data ?? [], // 데이터가 undefined일 경우를 대비해 기본값으로 빈 배열을 반환
    isLoading, 
    isError, 
    error 
  };
}