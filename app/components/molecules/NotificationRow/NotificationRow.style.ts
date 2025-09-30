import { StyleSheet } from "react-native";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: { flex: 1, marginLeft: 12 },
  headerLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  title: { fontWeight: "700", fontSize: 15, fontFamily: "SF Pro" },
  message: { color: "#3A3A3C", fontWeight: "400", fontSize: 13, fontFamily: "SF Pro" },
  rightActionWrap: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    marginVertical: 6,
  },
});
