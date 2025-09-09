// components/molecules/ChatHeader/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image as RNImage } from "react-native";
import { styles } from "./ChatHeader.style";

export type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMenuPress?: () => void;
};

const BACK_ICON = require("../../../../assets/images/back.png");

export const ChatHeader = ({ title, onBack, onMenuPress }: ChatHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <RNImage
          source={BACK_ICON}
          style={styles.backIcon} // ← 잊지 말기
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
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
