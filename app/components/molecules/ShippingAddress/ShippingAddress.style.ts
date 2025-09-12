import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    alignSelf: "stretch",
  },
  checkContainer: {
    width: 24,
    height: 24,
    aspectRatio: 1,
  },
  addressContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  textTitle: {
    alignSelf: "stretch",
    color: "#000",
    fontSize: 14.5,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 22,
  },
  textBody: {
    color: "#000",
    fontSize: 14.5,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
    alignSelf: "stretch",
  },
});
