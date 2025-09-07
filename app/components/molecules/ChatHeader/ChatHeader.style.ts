// components/molecules/ChatHeader/ChatHeader.style.ts
import { StyleSheet, Platform, StatusBar } from "react-native";

const topInset = Platform.select({
  ios: 12,
  android: (StatusBar.currentHeight || 0) + 8,
  default: 8,
});

export const styles = StyleSheet.create({
  container: {
    paddingTop: topInset,
    paddingHorizontal: 12,
    height: 56 + (topInset || 0),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  icon: {
    fontSize: 24,
    width: 28,
    textAlign: "center",
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },
  menu: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
});
