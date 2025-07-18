import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  return (
    <SafeAreaView style={styles.layout}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* 로고 이미지, 텍스트 */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="196"
              height="196"
              viewBox="0 0 196 196"
              fill="none"
            >
              <circle cx="98" cy="97.9532" r="97.9532" fill="#D9D9D9" />
            </svg>
          </View>
          <View>
            <Text style={styles.logoTitle}>서비스/캐치프레이즈</Text>
          </View>
        </View>

        {/* 로그인 폼 + 버튼 */}
        <View style={styles.loginGroup}>
          <View style={styles.loginForm}>
            <View style={styles.loginInput}>
              <TextInput
                style={styles.loginInputText}
                placeholder="이메일을 입력하세요"
                placeholderTextColor="#DBDBDB"
                value={email}
                onChangeText={setEmail}
              ></TextInput>
            </View>
            <View style={styles.loginInput}>
              <TextInput
                style={styles.loginInputText}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor="#DBDBDB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              ></TextInput>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.loginButton, isPressed && styles.loginButtonPressed]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={() => router.push("/(home)")}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입 버튼 */}
        <View>
          <Text style={styles.signUpText}>
            계정이 없으신가요?{" "}
            <Text
              style={styles.signUpTextBlue}
              onPress={() => router.push("/(signUp)")}
            >
              회원가입
            </Text>
          </Text>
        </View>

        {/* 소셜 로그인 */}
        <View style={styles.socialLoginWrapper}>
          {/* 카카오 로그인 */}
          <TouchableOpacity
            style={[styles.socialLoginButton, { backgroundColor: "#FEE500" }]}
          >
            <Image
              style={styles.socialLoginLogo}
              source={require("../../assets/images/kakao_logo.png")}
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
              source={require("../../assets/images/naver_logo.png")}
              resizeMode="cover"
            />
            <Text style={[styles.socialLoginText, { color: "#fff" }]}>
              네이버 로그인
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    width: 313,
    flexDirection: "column",
    alignItems: "center",
    gap: 36,
    marginHorizontal: 100,
    marginVertical: 40,
  },
  logoWrapper: {
    width: 198,
    height: 238,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  logoCircle: {
    width: 195.906,
    height: 195.906,
    flexShrink: 0,
    aspectRatio: 195.91 / 195.91,
  },
  logoTitle: {
    height: 25.763,
    color: "#000",
    textAlign: "center",
    fontFamily: "SF-Pro",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: 21,
    letterSpacing: -0.32,
    marginTop: 16.33,
  },
  loginGroup: {
    display: "flex",
    width: 313,
    flexDirection: "column",
    alignItems: "center",
    gap: 26,
  },
  loginForm: {
    display: "flex",
    width: 300,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  loginInput: {
    display: "flex",
    height: 35,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: "stretch",
    gap: 10,
    alignSelf: "stretch",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    backgroundColor: "#fff",
  },
  loginInputText: {
    color: "#000",
    fontFamily: "SF Pro",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  loginButton: {
    backgroundColor: "#fff",
    width: 313,
    height: 50,
    flexShrink: 0,
    borderRadius: 20,
    borderColor: "rgba(217, 217, 217, 0.80)",
    borderWidth: 1,
    shadowColor: "#000",
    boxShadow: "0px 3px 20px 0px rgba(0, 0, 0, 0.08)",
    paddingHorizontal: 130,
    paddingVertical: 14,
  },
  loginButtonText: {
    color: "#000",
    fontFamily: "SF Pro",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  loginButtonPressed: {
    backgroundColor: "084C63",
  },
  signUpText: {
    color: "#000",
    textAlign: "center",
    fontFamily: "SF Pro",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  signUpTextBlue: {
    color: "#08F",
    marginLeft: 5,
    fontWeight: 700,
  },
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
    flexShrink: 0,
    aspectRatio: 313 / 47,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(217, 217, 217, 0.80)",
    shadowColor: "#000",
    boxShadow: "0px 3px 20px 0px rgba(0, 0, 0, 0.08)",
    paddingVertical: 12,
  },
  socialLoginLogo: {
    width: 23,
    height: 23,
    marginRight: 74,
    marginLeft: 14,
  },
  socialLoginText: {
    textAlign: "center",
    fontFamily: "SF Pro",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 23,
    letterSpacing: -0.32,
  },
});
