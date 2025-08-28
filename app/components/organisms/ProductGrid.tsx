import React from "react";
import { Image, ImageSourcePropType, FlatList, Text, View, StyleSheet } from "react-native";
import { ChipTab } from "../../components/atoms/ChipTab";
import { ProductCard } from "../../components/molecules/ProductCard";
import type { ProductItem } from "../molecules/ProductCard"

type SortKey = "new" | "popular";

type Props = {
  title: string;
  iconSource: ImageSourcePropType; 
  sort: SortKey;
  onChangeSort: (s: SortKey) => void;
  products: ProductItem[]; 
  onPressProduct?: (id: number) => void;
};

export function ProductGrid({
  title, iconSource, sort, onChangeSort, products, onPressProduct
}: Props) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image source={iconSource} style={{ width: 40, height: 40, marginRight: 8 }} />
        <Text style={s.title}>{title}</Text>
      </View>

      <View style={s.tabsWrap}>
        <ChipTab
          label="최신순"
          active={sort === "new"}
          onPress={() => onChangeSort("new")}
          style={s.segment}
        />
        <ChipTab
          label="인기순"
          active={sort === "popular"}
          onPress={() => onChangeSort("popular")}
          style={s.segment}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(it) => String(it.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        renderItem={({ item }) => <ProductCard item={item} onPress={onPressProduct} />}
      />
    </View>
  );
}

export const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 20 },
  emoji: { fontSize: 22, marginRight: 8 },
  title: { fontSize: 30, fontWeight: "700", color: "#0B0C0F" },
  tabsWrap: {
    width: 370,
    height: 32,
    alignSelf: "center",        
    marginTop: 14,
    backgroundColor: "#F2F3F5",
    borderRadius: 16,
    padding: 4,
    flexDirection: "row",
    gap: 8,                    
  },

  segment: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 0,        
  },

  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 16 },
  listContent: { paddingTop: 16, paddingBottom: 16 },
});