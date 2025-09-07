// components/atoms/ChatBubble/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./ChatBubble.style";

export type ChatBubbleProps = {
  text: string;
  isSender: boolean; // true = 내가 보낸 말풍선(오른쪽)
  maxWidthPercent?: number; // 말풍선 가로 최대 비율 (기본 78%)
  onLongPress?: () => void;
};

export const ChatBubble = ({
  text,
  isSender,
  maxWidthPercent = 0.88,
  onLongPress,
}: ChatBubbleProps) => {
  return (
    <View style={[styles.row, isSender ? styles.rowEnd : styles.rowStart]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={onLongPress}
        style={[
          styles.bubble,
          { maxWidth: `${Math.round(maxWidthPercent * 100)}%` },
          isSender ? styles.bubbleSender : styles.bubbleReceiver,
        ]}
      >
        <Text
          style={[
            styles.text,
            isSender ? styles.textSender : styles.textReceiver,
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
