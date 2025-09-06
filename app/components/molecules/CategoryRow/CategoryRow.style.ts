import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 18, paddingHorizontal: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inner: { flexDirection: "row", alignItems: "center" },
  title: { marginLeft: 12, fontSize: 16, fontWeight: "700", color: "#111", flex: 1 },
});