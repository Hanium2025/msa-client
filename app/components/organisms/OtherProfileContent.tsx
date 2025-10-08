import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SortTabs } from "../molecules/SortTabs";
import { TradeProductsGrid } from "./TradeProductsGrid";

type TabKey = "sales" | "posts";
type ProductItem = { id: number; title: string; price: number; imageUrl?: string };
type PostItem = { id: number; title: string; imageUrl?: string };

export default function OtherProfileContent({
  salesItems,
  postItems,
  onPressProduct,
  onPressPost,
}: {
  salesItems: ProductItem[];
  postItems: PostItem[];
  onPressProduct: (id: number) => void;
  onPressPost: (id: number) => void;
}) {
  const [tab, setTab] = useState<TabKey>("sales");
  const sortedSales = useMemo(() => salesItems, [salesItems]);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 상단 탭 */}
      <View style={s.tabsWrap}>
        <SortTabs<TabKey>
          value={tab}
          onChange={setTab}
          items={[
            { key: "sales", label: "판매 상품" },
            { key: "posts", label: "작성한 글" },
          ]}
          segmented
          width={358}
        />
      </View>

      {/* 콘텐츠 */}
      <View style={s.body}>
        {tab === "sales" ? (
          <TradeProductsGrid items={sortedSales} onPressItem={onPressProduct} />
        ) : (
          <PostsGrid items={postItems} onPressItem={onPressPost} />
        )}
      </View>
    </ScrollView>
  );
}

function PostsGrid({
  items,
  onPressItem,
}: {
  items: { id: number; title: string; imageUrl?: string }[];
  onPressItem: (id: number) => void;
}) {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
      {items.length === 0 ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text>작성한 글이 없습니다.</Text>
        </View>
      ) : (
        items.map((p) => (
          <View
            key={p.id}
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 14,
              marginTop: 12,
              backgroundColor: "#fff",
            }}
            onTouchEnd={() => onPressItem(p.id)}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#111827" }} numberOfLines={2}>
              {p.title}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingBottom: 24, 
  },
  tabsWrap: { paddingHorizontal: 16, marginTop: 16 },
  body: { marginTop: 8 },
});
