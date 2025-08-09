import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, Text } from "react-native";
import LogoCircle from "../components/atoms/LogoCircle";
import LoginForm from "../components/molecules/LoginForm";
import Button from "../components/atoms/Button";
import SignUpPrompt from "../components/molecules/SignUpPrompt";
import SocialLoginGroup from "../components/organisms/SocialLoginGroup";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);

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
