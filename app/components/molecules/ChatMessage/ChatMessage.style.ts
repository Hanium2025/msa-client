// components/molecules/ChatMessage/ChatMessage.style.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
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
    flex: 1, //가변 폭
    maxWidth: "100%",
    alignItems: "center",
  },
  senderBump: {
    //보낸 말풍선만 오른쪽에서 살짝 띄우기
    marginRight: -1, // ← 원하는 간격으로 조절 (예: 10~20)
  },
  alignEnd: { alignItems: "flex-end" },
  alignStart: { alignItems: "flex-start" },
});
