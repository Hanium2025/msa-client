import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Alert,
  Platform,
} from "react-native";
import LogoCircle from "../components/atoms/LogoCircle";
import LoginForm from "../components/molecules/LoginForm";
import Button from "../components/atoms/Button";
import SignUpPrompt from "../components/molecules/SignUpPrompt";
import SocialLoginGroup from "../components/organisms/SocialLoginGroup";
import { router } from "expo-router";
import { login } from "../lib/api/user";
import { setAccessToken } from "../lib/api";
//import * as SecureStore from "expo-secure-store"; Expo에서 사용 가능

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showAlert = (title: string, message?: string) => {
    const text = [title, message].filter(Boolean).join("\n");
    if (Platform.OS === "web") window.alert(text);
    else Alert.alert(title, message);
  };

  const onSubmit = async () => {
    // 간단 검증
    if (!email.trim() || !password.trim()) {
      showAlert("로그인 실패", "이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      // 1) 로그인 요청
      const { accessToken } = await login({ email, password });

      // 2) 토큰 저장 (네이티브는 SecureStore, 웹은 localStorage)
      try {
        await localStorage.setItemAsync("accessToken", accessToken);
      } catch {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", accessToken);
        }
      }

      // 3) 이후 요청에 Authorization 자동 첨부
      setAccessToken(accessToken);
      console.log("로그인 성공");

      // 4) 이동
      router.replace("/(home)");
    } catch (e: any) {
      // 서버 명세의 401 처리
      const status = e?.response?.status;
      const message =
        status === 401
          ? "이메일 또는 비밀번호가 일치하지 않습니다."
          : e?.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      setErrorMsg(message);
      showAlert("로그인 실패", message);
    } finally {
      setLoading(false);
      setIsPressed(false);
    }
  };

  return (
    <SafeAreaView style={{ alignItems: "center" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ marginTop: 40, gap: 36, alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <LogoCircle />
          <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 16 }}>
            서비스/캐치프레이즈
          </Text>
        </View>
        <View style={{ gap: 26, alignItems: "center" }}>
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
          <Button
            text="로그인"
            variant="login"
            isPressed={isPressed}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={() => router.push("/(home)")}
          />
        </View>
        <SignUpPrompt />
        <SocialLoginGroup />
      </View>
    </SafeAreaView>
  );
}
