import React from "react";
import { FlatList, ListRenderItem, View, Text, StyleSheet } from "react-native";
import NotificationRow, { NotificationItem } from "../molecules/NotificationRow";

type Props = {
  data: NotificationItem[];
  onPressItem?: (item: NotificationItem) => void;
  onDeleteItem?: (item: NotificationItem) => void;
};

export default function NotificationList({ data, onPressItem, onDeleteItem }: Props) {
  const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
    <NotificationRow item={item} onPress={onPressItem} onDelete={onDeleteItem} />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>알림</Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 8, paddingHorizontal: 16, paddingBottom: 6 },
  headerTitle: { fontSize: 30, fontWeight: "700", fontFamily: "SF Pro" },
});
