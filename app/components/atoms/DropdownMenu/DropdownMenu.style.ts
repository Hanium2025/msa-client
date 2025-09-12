import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  box: {
    width: 314,
    height: 37,
    padding: 8,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    backgroundColor: "rgba(217, 217, 217, 0)",
  },
  textBox: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    color: "rgba(0, 0, 0, 0.44)",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  menu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 8,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuItemPressed: {
    backgroundColor: "#F5F5F5",
  },
  menuItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111",
  },
});
