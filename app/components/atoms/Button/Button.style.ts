import { StyleSheet, Platform} from "react-native";

const COLOR = {
  primary: "#0F5564",
  white: "#FFFFFF",
  shadow: "#0B3140",
};

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
    backgroundColor: "#023047",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#C1F209",
  },

  wrapper: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  gradientBorder: {
    borderRadius: 10,
    padding: 1, // 테두리 두께
  },
  // registerItem
  registerWrapper: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  registerGradientBorder: {
    borderRadius: 10,
    padding: 1, // 테두리 두께
  },
  registerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // 왼쪽 정렬
    width: 376,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12, // 왼쪽 여백
  },
  registerIcon: {
    marginRight: 8,
  },
  registerText: {
    fontSize: 16,
    color: "#000",
  },
  registerImage: {
    width: 18,
    height: 18,
    marginRight: 8,
  },

  // reportSubmit(신고 제출 버튼)
  reportSubmitButton: {
    width: 219,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#084C63",
  },
  reportSubmitContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportSubmitImage: {
    width: 16.215,
    height: 14.141,
  },
  reportSubmitText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.32,
  },

  // reportToProduct (보던 상품으로 돌아가기 버튼)
  reportToProductButton: {
    width: 313,
    height: 57,
    borderRadius: 20,
    backgroundColor: "#084C63",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  reportToProductDisabled: { opacity: 0.5 },
  reportToProductText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  // reportToHome (홈으로 버튼)
  reportToHomeButton: {
    width: 313,
    height: 48,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.80)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reportToHomeDisabled: { opacity: 0.5 },
  reportToHomeText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  profilePrimaryButton: {
    width: 219,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#084C63",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  profilePrimaryText: {
    color: "#FFF",
    fontFamily: "SF Pro",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.32,
  },

  // 왼쪽 "이전"
  profileOutlineButton: {
    width: 113,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(217,217,217,0.70)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileOutlineText: {
    color: "#000",
    fontFamily: "SF Pro",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.32,
  },

  // 아바타 수정 원형 버튼
  profileEditCircleButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  profileEditCircleIcon: {

  },
  // 송장등록 버튼
  waybillPrimaryButton: {
    width: 219,          // 필요 시 부모에서 덮어쓰기
    height: 40,
    borderRadius: 20,
    backgroundColor: "#084C63",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#D9D9D9B2",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
      },
    }),
  },
  waybillPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "SF Pro",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  waybillPrimaryIcon: {
    marginRight: 8,
    resizeMode: "contain",
  },

  waybillSelectIcon: {
  marginLeft: 4,
  marginTop: 2,
  resizeMode: "contain",
},

  // 필드 우측 “선택”
  waybillSelectButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  waybillSelectText: {
    color: "#084C63", 
    fontSize: 15,
    fontWeight: "500",
  },

  paymentRetryButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 260,            // 스샷처럼 넉넉한 폭
    alignSelf: "center",
    shadowColor: COLOR.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  paymentRetryText: {
    color: COLOR.white,
    fontSize: 18,
    fontWeight: "700",
  },
  paymentRetryPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  paymentRetryDisabled: {
    opacity: 0.5,
  },
});
