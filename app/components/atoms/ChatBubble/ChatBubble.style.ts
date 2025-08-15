// components/atoms/ChatBubble/ChatBubble.style.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: { width: "100%", paddingHorizontal: 12, marginVertical: 4 },
  rowEnd: { alignItems: "flex-end" },
  rowStart: { alignItems: "flex-start" },

  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  bubbleSender: {
    backgroundColor: "#C9F87A", // 연녹색(시안 참고)
    borderTopRightRadius: 6,
  },
  bubbleReceiver: {
    backgroundColor: "#E6EEF5", // 연파랑/회색
    borderTopLeftRadius: 6,
  },

  text: { fontSize: 15, lineHeight: 20 },
  textSender: { color: "#1A1A1A" },
  textReceiver: { color: "#1A1A1A" },
});
