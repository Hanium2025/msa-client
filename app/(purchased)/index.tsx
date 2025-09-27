import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { SortTabs } from "../components/molecules/SortTabs";
import { TradeProductsGrid } from "../components/organisms/TradeProductsGrid";
import BottomTabBar from "../components/molecules/BottomTabBar";

// 목업 데이터 (연동 전)
const mockItems = [
  { id: 10, title: "기저귀 3팩", price: 29000, imageUrl: "" },
  { id: 11, title: "아기욕조", price: 24000, imageUrl: "" },
  { id: 12, title: "아기띠", price: 79000, imageUrl: "" },
];

export type SortKey = "new" | "old";
const PHONE_WIDTH = 390;
const TABBAR_SPACE = 90;

export default function PurchasedPage() {
  const [sort, setSort] = useState<SortKey>("new");
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<"notifications" | "chat" | "home" | "community" | "profile">(
      "home"
    );
  const onTabPress = (tab: string) => setActiveTab(tab as any);

  const [items] = useState(mockItems);

  const sorted = useMemo(() => {
    if (sort === "new") return items;
    return [...items].reverse();
  }, [items, sort]);

  return (
    <View style={s.webRoot}>
      <SafeAreaView style={s.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Text style={s.title}>구매한 상품</Text>
        </View>

        <SortTabs<SortKey> value={sort} onChange={setSort} />

        {!items.length ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text>구매한 상품이 없습니다.</Text>
          </View>
        ) : (
          <TradeProductsGrid
            items={sorted}
            onPressItem={(id) =>
              router.push({
                pathname: "/(addProduct)/detail",
                params: { productId: String(id) },
              })
            }
            onEndReached={() => {}}
            ListFooterComponent={<View style={{ height: TABBAR_SPACE }} />}
          />
        )}
        <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
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
