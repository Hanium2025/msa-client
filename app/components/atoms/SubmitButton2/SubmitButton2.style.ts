import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 24,
    width: 313,
    height: 57,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.80)",
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: "#084C63",
  },
  disabledButton: {
    backgroundColor: "#084C63",
    opacity: 0.4,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#fff",
  },
});
