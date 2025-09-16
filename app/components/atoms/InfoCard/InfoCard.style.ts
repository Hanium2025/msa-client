import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "SF Pro",
    fontWeight: "700",
    color: "#000",
  },
  desc: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: "SF Pro",
    fontWeight: "400",
    color: "#000",
    lineHeight: 18,
  },
  content: {
    marginTop: 12,
  },
});
