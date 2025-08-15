// components/molecules/ChatMessage/ChatMessage.style.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginLeft: 8,
  },
  avatarSpacer: {
    width: 46, // avatar + margin 폭만큼 공간 확보
  },
  bubbleCol: {
    flexShrink: 1,
    maxWidth: "86%",
  },
  alignEnd: { alignItems: "flex-end" },
  alignStart: { alignItems: "flex-start" },
});
