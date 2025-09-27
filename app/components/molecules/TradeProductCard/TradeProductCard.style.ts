import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  thumb: {
    width: 165,
    height: 120,
    borderRadius: 16,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  img: { width: 165, height: 120 },
  imgPlaceholder: { flex: 1, backgroundColor: "#E5E7EB" },

  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "SF-Pro",
    color: "#0B0C0F",
  },
  price: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: "SF-Pro",
    fontWeight: "600",
    color: "#0B3B4C", 
  },
});
