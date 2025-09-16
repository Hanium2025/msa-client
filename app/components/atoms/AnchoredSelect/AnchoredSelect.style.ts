import { StyleSheet, Platform } from "react-native";

const SHADOW_IOS = {
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 10 },
};
const SHADOW_ANDROID = { elevation: 10 };
// RN Web 보완
const SHADOW_WEB: any = { boxShadow: "0 10px 24px rgba(0,0,0,0.18)" };

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  menu: {
    position: "absolute",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    ...Platform.select({
      ios: SHADOW_IOS,
      android: SHADOW_ANDROID,
      web: SHADOW_WEB,
    }),
  },
  list: { paddingVertical: 2, minWidth: 220, maxWidth: 280 },
  item: {
    minHeight: 42,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  itemPressed: { backgroundColor: "rgba(0,0,0,0.04)" },
  itemActive: { backgroundColor: "rgba(15,89,101,0.10)" },
  itemText: { fontSize: 14.5, color: "#1D1D1F" },
  itemTextActive: { color: "#0F5965", fontWeight: "700" },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginHorizontal: 8,
  },
});
