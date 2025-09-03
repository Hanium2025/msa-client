import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  chip: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: "transparent",
  },
  chipActive: {
    backgroundColor: "white",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { fontSize: 14, color: "#5E6470", fontWeight: "600", textAlign: "center", },
  labelActive: { color: "#111", fontWeight: "700" },
});
