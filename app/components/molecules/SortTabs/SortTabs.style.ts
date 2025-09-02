import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  segmentWrap: {
    alignSelf: "center",
    height: 32,
    marginTop: 14,
    backgroundColor: "#F2F3F5",
    borderRadius: 16,
    padding: 4,
    flexDirection: "row",
    gap: 8,
  },
  segmentTab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 0,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  rowTab: {
    flex: 1,
  },
});
