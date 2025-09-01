// app/(category)/[slug].tsx
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { CATEGORIES } from "../constants/categories";
import { useCategoryProducts } from "../hooks/useCategoryProducts";

export default function CategoryGridScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const cat =
    CATEGORIES.find((c) => c.slug === slug) ??
    CATEGORIES.find((c) => c.slug === "OTHER")!;

  const {
    sort,            
    setSort,         
    items,           
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
