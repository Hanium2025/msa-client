// components/atoms/ChatTimestamp/index.tsx
import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import { styles } from "./ChatTimestamp.style";

export type ChatTimestampProps = {
  timestamp: number | string | Date;
  align?: "left" | "right" | "center";
  style?: StyleProp<ViewStyle>;
};

function formatKRTimestamp(input: number | string | Date) {
  const d = input instanceof Date ? input : new Date(input);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${hour12}:${m}`;
}

export const ChatTimestamp = ({
  timestamp,
  align = "right",
  style,
}: ChatTimestampProps) => {
  return (
    <View
      style={[
        styles.container,
        align === "left" && styles.left,
        align === "center" && styles.center,
        style,
      ]}
    >
      <Text style={styles.text}>{formatKRTimestamp(timestamp)}</Text>
    </View>
  );
};
