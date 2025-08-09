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

  // login (로그인 버튼)
  loginButton: {
    backgroundColor: "#fff",
    width: 313,
    height: 50,
    borderRadius: 20,
    borderColor: "rgba(217, 217, 217, 0.80)",
    borderWidth: 1,
    paddingHorizontal: 130,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loginButtonPressed: {
    backgroundColor: "#084C63",
  },
  loginText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  // socialLogin (소셜로그인 버튼)
  socialButton: {
    width: 313,
    height: 47,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.80)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  socialTextWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  socialText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 23,
    letterSpacing: -0.32,
  },
  socialIcon: {
    marginRight: 74,
  },

  // 공통 row
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  button: {
    backgroundColor: '#023047',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C1F209',
  },

  wrapper: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 10,
    padding: 1, // 테두리 두께
  },
  registerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: 376, 
    height: 44,
    borderRadius: 10,

    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  
  
});
