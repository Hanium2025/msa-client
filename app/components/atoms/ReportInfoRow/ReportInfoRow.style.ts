import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontWeight: "400",
  },
  input: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    padding: 0,
    // 폭/축소 이슈로 입력이 안 보이는 것 방지
    minWidth: 80,
    maxWidth: "70%",
    flexShrink: 1,
    minHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
});
