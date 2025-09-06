import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import { CategoryList } from "../components/organisms/CategoryList";
import { CATEGORIES, CategoryItem } from "../constants/categories";

export default function CategoryIndexScreen() {
  const router = useRouter();

  const onPressItem = useCallback((item: CategoryItem) => {
    router.push({
      pathname: "/(category)/[slug]",
      params: { slug: item.slug, title: item.title },
    });
  }, [router]);

  return <CategoryList items={CATEGORIES} onPressItem={onPressItem} />;
}
