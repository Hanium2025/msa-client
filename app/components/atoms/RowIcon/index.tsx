// 각 메뉴 항목(ListRow) 왼쪽에 붙는 작은 아이콘/이모지 표시
import React from "react";
import { View, Text, Image, ViewStyle, StyleProp } from "react-native";
import styles from "./RowIcon.style";

type Props = {
  source?: any; // require("...") 또는 { uri }
  emoji?: string; // 간단 대체 아이콘
  style?: StyleProp<ViewStyle>;
};

export default function RowIcon({ source, emoji, style }: Props) {
  if (emoji) {
    return (
      <View style={[styles.iconBox, style]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.iconBox, style]}>
      {source ? <Image source={source} style={styles.iconImg} /> : null}
    </View>
  );
}
