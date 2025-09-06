import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "../../atoms/Avatar";
import UnreadBadge from "../../atoms/UnreadBadge";

export type ChatPreview = {
  id: string | number;
  partnerName: string;
  productTitle: string;
  lastMessage: string;
  updatedAt: string | number | Date;
  opponentProfileUrl?: string;
  opponentNickname?: string;
  unreadCount?: number;
};

export default function ChatListItem({
  item,
  onPress,
}: {
  item: ChatPreview;
  onPress?: (id: ChatPreview["id"]) => void;
}) {
  const time = formatTime(item.updatedAt);

  return (
    <TouchableOpacity onPress={() => onPress?.(item.id)} activeOpacity={0.7}>
      <View style={styles.row}>
        <Avatar uri={item.opponentProfileUrl} size={44} />
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {item.opponentNickname}/{item.productTitle}
          </Text>
          <Text style={styles.preview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.time}>{time}</Text>
          <UnreadBadge count={item.unreadCount} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  center: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: "700", color: "#111" },
  preview: { fontSize: 13, color: "#666", marginTop: 2 },
  right: { alignItems: "flex-end", gap: 8, marginLeft: 12 },
  time: { fontSize: 12, color: "#888" },
});

function formatTime(t: any) {
  const d = new Date(t);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    const hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ap = hh >= 12 ? "오후" : "오전";
    const h12 = ((hh + 11) % 12) + 1;
    return `${ap} ${h12}:${mm}`;
  }
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  const yesterday =
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate();
  if (yesterday) return "어제";
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
