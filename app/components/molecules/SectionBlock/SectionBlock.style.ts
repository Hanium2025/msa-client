import { StyleSheet } from "react-native";

export default StyleSheet.create({
  block: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    // shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    // shadow (Android)
    elevation: 3,
    // 카드 안쪽 패딩 살짝
    paddingVertical: 4,
  },
});
