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
    padding: 0, // RN 기본 padding 제거
    minWidth: 80,
    maxWidth: "70%",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
});
