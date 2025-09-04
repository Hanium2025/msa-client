// app/(favorites)/index.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { FavoritesGrid } from "../components/organisms/FavoritesGrid";
import { SortTabs } from "../components/molecules/SortTabs";
import { useFavorites } from "../hooks/useFavorites";
import { useToggleLikeList } from "../hooks/useToggleLikeList"; // 리스트용 토글 훅
import { tokenStore } from "../auth/tokenStore";

export type SortKey = "new" | "old";
const PHONE_WIDTH = 390; // iPhone 14 Pro width

export default function FavoritesPage() {
  const [sort, setSort] = useState<SortKey>("new");

  // 관심목록 조회
  const {
    items,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
  } = useFavorites();

  // 낙관적 업데이트용 로컬 상태
  const [localItems, setLocalItems] = useState(items);
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // 토큰 불러오기
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    tokenStore.get().then(setToken);
  }, []);

  // 관심 토글 mutation
  const mutation = useToggleLikeList(token ?? "");

  // 정렬
  const sorted = useMemo(() => {
    if (sort === "new") return localItems;
    return [...localItems].reverse();
  }, [localItems, sort]);

  // 관심 해제 (별 클릭)
  const toggleLike = (id: number) => {
    if (!token) return;

    // 낙관적 업데이트: 목록에서 바로 제거
    setLocalItems((prev) => prev.filter((it) => it.id !== id));

    // 서버 요청
    mutation.mutate(id, {
      onError: () => {
        // 실패 시 되돌리기
        const original = items.find((it) => it.id === id);
        if (original) setLocalItems((prev) => [...prev, original]);
      },
    });
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

        <SortTabs<SortKey> value={sort} onChange={setSort} />

        {isLoading ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FavoritesGrid
            items={sorted}
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
