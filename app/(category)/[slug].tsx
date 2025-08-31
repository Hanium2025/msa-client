// app/(category)/[slug].tsx
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { CATEGORIES } from "../constants/categories";
import { useCategoryProducts } from "../hooks/useCategoryProducts";

export default function CategoryGridScreen() {
  // slug는 서버 enum과 동일: "TRAVEL" | "FEEDING" | "SLEEP" | ...
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  // UI 표시용(아이콘/한글 타이틀)
  const cat =
    CATEGORIES.find((c) => c.slug === slug) ??
    // fallback: 기타
    CATEGORIES.find((c) => c.slug === "OTHER")!;

  // 서버 요청: slug 그대로 {category} 에 사용됨
  const {
    sort,            // 'new' | 'popular'
    setSort,         // 정렬 변경 시 자동 refetch (서버: recent | like로 변환)
    items,           // { id, title, price, imageUrl }[]
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
  } = useCategoryProducts(String(slug ?? "OTHER"), "new");

  return (
    <ProductGrid
      title={cat.title}
      iconSource={cat.icon}
      sort={sort}
      onChangeSort={setSort}
      products={items}
      loading={loading}
      errorText={error ?? undefined}
      onRefresh={refresh}
      onEndReached={hasMore ? loadMore : undefined}
      onPressProduct={(id) =>
        router.push({
          pathname: "/(addProduct)/detail",
          params: { id: String(id) },
        })
      }
    />
  );
}
