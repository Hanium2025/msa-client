import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

export default function SocialLoginGroup() {
  return (
    <View style={styles.socialLoginWrapper}>
      {/* 카카오 로그인 */}
      <TouchableOpacity
        style={[styles.socialLoginButton, { backgroundColor: "#FEE500" }]}
      >
        <Image
          style={styles.socialLoginLogo}
          source={require("../../../assets/images/kakao_logo.png")}
          resizeMode="cover"
        />
        <Text style={styles.socialLoginText}>카카오 로그인</Text>
      </TouchableOpacity>

      {/* 네이버 로그인 */}
      <TouchableOpacity
        style={[styles.socialLoginButton, { backgroundColor: "#03C75A" }]}
      >
        <Image
          style={styles.socialLoginLogo}
          source={require("../../../assets/images/naver_logo.png")}
          resizeMode="cover"
        />
        <Text style={[styles.socialLoginText, { color: "#fff" }]}>
          네이버 로그인
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialLoginWrapper: {
    width: 313,
    height: 102,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  socialLoginButton: {
    display: "flex",
    flexDirection: "row",
    width: 313,
    height: 47,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.80)",
    paddingVertical: 12,
    alignItems: "center",
  },
  socialLoginLogo: {
    width: 23,
    height: 23,
    marginRight: 74,
    marginLeft: 14,
  },
  socialLoginText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 23,
    letterSpacing: -0.32,
  },
});
