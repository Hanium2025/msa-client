import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  table: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  rowLast: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  cell: {
    fontSize: 12,
    fontFamily: "SF Pro",
    fontWeight: "400",            
    color: "#222",
  },
  headerRow: {
    backgroundColor: Platform.select({ web: "#fff", default: "#fff" }),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  headerCell: {
    fontSize: 15,
    color: "#000",
    fontFamily: "SF Pro",
    fontWeight: "400",           
  },

  // (시간/위치/상태)
  timeCol: { flex: 1.5 },
  locCol:  { flex: 1 },
  statCol: { flex: 0.9 },

  // 시간 칸 숫자 고정폭
  timeMono: Platform.select({
    ios: { fontVariant: ["tabular-nums"] }, // iOS
    android: { fontFamily: "monospace" },   // Android
    default: {},
  }),
});
