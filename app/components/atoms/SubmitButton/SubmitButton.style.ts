import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 24,
    width: 313,
    height: 57,
    marginLeft: 8,
    borderColor: "rgba(217, 217, 217, 0.80)",
    borderWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonPressed: {
    backgroundColor: "#084C63",
  },
  submitText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
