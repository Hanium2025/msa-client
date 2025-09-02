// app/(favorites).tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { FavoritesGrid } from "../components/organisms/FavoritesGrid";
import { SortTabs } from "../components/molecules/SortTabs";

export type SortKey = "new" | "old";

const PHONE_WIDTH = 390; // iPhone 14 Pro width

const MOCK = [
  { id: 1, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-31T08:00:00Z" },
  { id: 2, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-30T08:00:00Z" },
  { id: 3, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-28T08:00:00Z" },
  { id: 4, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-20T08:00:00Z" },
  { id: 5, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-18T08:00:00Z" },
  { id: 6, title: "상품명 ABCDE", price: 99000, imageUrl: undefined, liked: true,  createdAt: "2025-08-10T08:00:00Z" },
];

export default function FavoritesPage() {
  const [sort, setSort] = useState<SortKey>("new");
  const [items, setItems] = useState(MOCK);

  const sorted = useMemo(() => {
    const cp = [...items];
    cp.sort((a, b) => {
      const da = +new Date(a.createdAt);
      const db = +new Date(b.createdAt);
      return sort === "new" ? db - da : da - db;
    });
    return cp;
  }, [items, sort]);

  const toggleLike = (id: number) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, liked: !it.liked } : it)));
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

        <SortTabs value={sort} onChange={setSort} />

        <FavoritesGrid
          items={sorted}
          onToggleLike={toggleLike}
          onPressItem={openDetail}
        />
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
