import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",

    flex: 1,
  },
  title: { fontSize: 13, fontWeight: "400", color: "#3C3C43" },
  subtitle: { fontSize: 17, color: "#999" },
  rightBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
