import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import ChatListItem, { ChatPreview } from "../molecules/ChatListItem";

export default function ChatList({
  data,
  onPress,
}: {
  data: ChatPreview[];
  onPress?: (id: ChatPreview["id"]) => void;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(it) => String(it.id)}
      renderItem={({ item }) => <ChatListItem item={item} onPress={onPress} />}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      getItemLayout={(_, index) => ({ length: 68, offset: 68 * index, index })}
      initialNumToRender={12}
      windowSize={10}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  // 아바타 폭(44) + 패딩을 고려한 들여쓰기로 스샷처럼 라인이 맞음
  sep: { height: 1, backgroundColor: "#eee", marginLeft: 68 },
});
