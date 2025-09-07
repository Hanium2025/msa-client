import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  termText: {
    fontSize: 14,
    color: "#000",
  },
  boldText: {
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 12,
    color: "#999",
    marginRight: 4,
  },
  flexSpacer: {
    flex: 1,
  },
});

export default styles;
