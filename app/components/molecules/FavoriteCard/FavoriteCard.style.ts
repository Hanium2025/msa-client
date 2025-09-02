import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: { flex: 1, marginHorizontal: 8, marginTop: 16 },
  thumbWrap: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: "SF Pro",
    fontWeight: 400,
    color: "#0f172a",
    flexShrink: 1,
    marginRight: 4,
  },
});
