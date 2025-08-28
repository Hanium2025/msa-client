import React, { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { CATEGORIES } from "../constants/categories";

interface ProductItem {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
}

function useMockProducts(slug: string, sort: "new" | "popular"): ProductItem[] {
  const base: ProductItem[] = new Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    title: `상품명 ABCDE ${i + 1}`,
    price: 99000 + i * 1000,
  }));
  return sort === "popular" ? base.slice().reverse() : base;
}

export default function CategoryGridScreen() {
  const { slug, title } = useLocalSearchParams<{ slug: string; title?: string }>();
  const [sort, setSort] = useState<"new" | "popular">("new");
  const router = useRouter();

  const category = useMemo(
    () => CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0],
    [slug]
  );

  const products = useMockProducts(String(slug ?? "etc"), sort);

  return (
    <ProductGrid
      title={(title as string) || category.title}
      iconSource={category.icon}            
      sort={sort}
      onChangeSort={setSort}
      products={products}
      onPressProduct={(id) =>
        router.push({
          pathname: "/(addProduct)/detail",
          params: { id: String(id) },
        })
      }
    />
  );
}
