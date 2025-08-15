// components/molecules/ChatHeader/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./ChatHeader.style";

export type ChatHeaderProps = {
  title: string; // "구매자명 / 상품명ABC"
  subtitle?: string; // 상태, 마지막 접속 등
  onBack?: () => void;
  onMenuPress?: () => void; // 우측 ⋮
};

export const ChatHeader = ({
  title,
  subtitle,
  onBack,
  onMenuPress,
}: ChatHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.icon}>{"‹"}</Text>
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onMenuPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.menu}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};
