import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SortTabs } from "../components/molecules/SortTabs";
import { TradeProductsGrid } from "../components/organisms/TradeProductsGrid";
import BottomTabBar from "../components/molecules/BottomTabBar";

import { useMyTradeItems } from "../hooks/useMyTradeItems";
import { getMyPurchasedItem } from "../lib/api/profile";


export type SortKey = "new" | "old";
const PHONE_WIDTH = 390;
const TABBAR_SPACE = 90;

export default function PurchasedPage() {
  const [sort, setSort] = useState<SortKey>("new");
  const router = useRouter();
  const { items: purchaseItems, isLoading, isError, error } = useMyTradeItems(
    ['myPurchaseItems'], // '구매 내역'을 위한 고유 캐시 키
    getMyPurchasedItem    // '구매 내역'을 가져오는 API 함수
  );

  const [activeTab, setActiveTab] =
    useState<"notifications" | "chat" | "home" | "community" | "profile">(
      "home"
    );
  const onTabPress = (tab: string) => setActiveTab(tab as any);

  // const [items] = useState(mockItems);

  const formattedItems = useMemo(() => {
      const sortedItems = sort === "new" ? purchaseItems : [...purchaseItems].reverse();
  
      return sortedItems.map((item) => ({
        id: item.productId,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl ?? undefined,
      }));
    }, [purchaseItems, sort]);
  
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

  return (
    <View style={s.webRoot}>
      <SafeAreaView style={s.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Text style={s.title}>구매한 상품</Text>
        </View>

        <SortTabs<SortKey> value={sort} onChange={setSort} />


        {!purchaseItems.length ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text>구매한 상품이 없습니다.</Text>
          </View>
        ) : (
          <TradeProductsGrid
            items={formattedItems}
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
