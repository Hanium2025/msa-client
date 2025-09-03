// app/(favorites)/index.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform, ActivityIndicator } from "react-native";
import { FavoritesGrid } from "../components/organisms/FavoritesGrid";
import { SortTabs } from "../components/molecules/SortTabs";
import { useFavorites } from "../hooks/useFavorites";

export type SortKey = "new" | "old";
const PHONE_WIDTH = 390; // iPhone 14 Pro width

export default function FavoritesPage() {
  const [sort, setSort] = useState<SortKey>("new");
  const { items, isLoading, isFetchingNextPage, hasNextPage, loadMore } = useFavorites();

  const sorted = useMemo(() => {
    if (sort === "new") return items;
    return [...items].reverse();
  }, [items, sort]);

  const toggleLike = (id: number) => {
    // 관심 해제/재설정 API가 있다면 여기에서 호출 + 낙관적 업데이트 처리
  };

  const openDetail = (id: number) => {
    // router.push(`/product/${id}`)
  };

  return (
    <View style={s.webRoot}>
      <SafeAreaView style={s.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        <View style={s.header}>
          <Text style={s.title}>나의 관심 상품</Text>
        </View>

        <SortTabs<SortKey> value={sort} onChange={(v) => setSort(v)} />

        {isLoading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FavoritesGrid
            items={sorted as Product[]}
            onToggleLike={toggleLike}
            onPressItem={openDetail}
            onEndReached={() => hasNextPage && loadMore()}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={{ paddingVertical: 16, alignItems: "center" }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  title: { fontSize: 30, fontWeight: "700", fontFamily: "SF Pro" },
});
