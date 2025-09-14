import { StyleSheet } from "react-native";

const LABEL_COL_WIDTH = 72;

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E9EC",
  },
  label: { width: LABEL_COL_WIDTH, fontSize: 16, fontWeight: "800" },
  content: { flex: 1, justifyContent: "center", minHeight: 24 },
  input: { fontSize: 16, paddingVertical: 0 },
});
