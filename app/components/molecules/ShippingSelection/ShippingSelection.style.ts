import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  selectionContainer: {
    display: "flex",
    height: 31,
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },
  selectionItemBase: {
    width: 157,
    height: 31,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionItemBlue: {
    backgroundColor: "rgba(8, 76, 99, 1)",
  },
  selectionItemGray: {
    backgroundColor: "rgba(217, 217, 217, 1)",
  },
  textBase: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  textBlue: {
    color: "#FFF",
  },
  textGray: {
    color: "#9C9C9C",
  },
});
