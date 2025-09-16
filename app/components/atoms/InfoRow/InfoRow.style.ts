import { StyleSheet } from "react-native";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    width: 64,
    color: "#141414",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
  },
  value: {
    flex: 1,
    color: "#1D1D1F",
    fontSize: 15,
    lineHeight: 20,
  },
  valueRight: {
    textAlign: "right",
  },
  link: {
    color: "#084C63",
    fontWeight: "500",
  },
});
