import { StyleSheet } from "react-native";

export default StyleSheet.create({
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  label: {
    width: 72,
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1D1F",
  },
  middle: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  right: {
    paddingRight: 6,
  },
});
