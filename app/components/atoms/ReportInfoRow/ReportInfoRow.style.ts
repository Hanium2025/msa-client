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
  value: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "right",
    color: "#084C63", // 읽기 전용 텍스트니까 고정
    flexShrink: 1,
    maxWidth: "70%",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
});
