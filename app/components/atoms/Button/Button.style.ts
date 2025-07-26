import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // 공통 base
  baseButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  // action
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderColor: "#084C63",
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  actionText: {
    color: "#084C63",
    fontSize: 14,
  },

  // submit (다음으로 버튼)
  submitButton: {
    padding: 16,
    marginTop: 24,
    width: 313,
    height: 57,
    justifyContent: "center",
    borderColor: "rgba(217, 217, 217, 0.80)",
    borderWidth: 1,
    alignSelf: "center",
  },
  submitButtonPressed: {
    backgroundColor: "#084C63",
  },
  submitText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: "center",
  },

  // signUpComplete (회원가입 완료 버튼)
  signUpCompleteButton: {
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
    backgroundColor: "#084C63",
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  signUpCompleteButtonDisabled: {
    backgroundColor: "#084C63",
    opacity: 0.4,
  },
  signUpCompleteText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#fff",
  },

  // check
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "transparent",
    elevation: 0,
    width: 24,
    height: 24,
  },
  checkText: {
    color: "#333",
    fontSize: 13,
  },
  checkIcon: {
    marginRight: 12,
  },

  // 공통 row
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
