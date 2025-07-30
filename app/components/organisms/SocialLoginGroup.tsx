import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import Button from "../atoms/Button";

export default function SocialLoginGroup() {
  return (
    <View style={styles.socialLoginWrapper}>
      {/* 카카오 로그인 */}
      <Button
        text="카카오 로그인"
        variant="socialLogin"
        backgroundColor="#FEE500"
        textColor="#000"
        icon={
          <Image
            source={require("../../../assets/images/kakao_logo.png")}
            style={styles.socialLoginLogo}
            resizeMode="cover"
          />
        }
        onPress={() => console.log("카카오 로그인")}
      />

      {/* 네이버 로그인 */}
      <Button
        text="네이버 로그인"
        variant="socialLogin"
        backgroundColor="#03C75A"
        textColor="#fff"
        icon={
          <Image
            source={require("../../../assets/images/naver_logo.png")}
            style={styles.socialLoginLogo}
            resizeMode="cover"
          />
        }
        onPress={() => console.log("네이버 로그인")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  socialLoginWrapper: {
    width: 313,
    height: 102,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  socialLoginLogo: {
    width: 23,
    height: 23,
    marginRight: 74,
    marginLeft: 14,
  },
});
