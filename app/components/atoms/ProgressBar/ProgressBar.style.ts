// ProgressBar.style.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    width: 215,
    height: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 30,
    backgroundColor: "#FFF",
    shadowColor: "#084C63",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 4, // Android 그림자
    padding: 0,
  },
  track: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#084C63",
    borderRadius: 30,
  },
});
