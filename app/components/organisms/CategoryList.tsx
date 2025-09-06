import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import { CategoryRow } from "../../components/molecules/CategoryRow";
import { CategoryItem } from "../../constants/categories";

type Props = {
  items: CategoryItem[];
  onPressItem: (item: CategoryItem) => void;
};

export function CategoryList({ items, onPressItem }: Props) {
  return (
    <View style={s.container}>
      <Text style={s.title}>카테고리 탐색</Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.slug}
        renderItem={({ item }) => (
          <CategoryRow
            icon={item.icon}
            title={item.title}
            onPress={() => onPressItem(item)}
          />
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 12 }}
      />
    </View>
  );
}

export const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: 24 },
  title: {  fontFamily: "SF Pro", fontSize: 28, fontWeight: "700", paddingHorizontal: 16, marginBottom: 8, color: "#0B0C0F" },
});