import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    width: 270,
    height: 102,
    borderRadius: 14,
    backgroundColor: "#fff",
    paddingTop: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  title: {
    fontSize: 17,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  message: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    height: 44,
    marginTop: 17,
  },
  btn: { flex: 1 },
  btnInner: { flex: 1, alignItems: "center", justifyContent: "center" },
  btnPressed: { backgroundColor: "rgba(0,0,0,0.05)" },
  btnText: { fontSize: 15, fontWeight: "600" },
  btnPrimary: { color: "#007AFF" },
  dividerV: { width: StyleSheet.hairlineWidth, backgroundColor: "#E5E7EB" },
});
