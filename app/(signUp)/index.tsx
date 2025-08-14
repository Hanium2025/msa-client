import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Alert,
  Platform,
} from "react-native";
import EmailInput from "../components/organisms/EmailInput";
import PasswordInput from "../components/organisms/PasswordInput";
import ConfirmPasswordInput from "../components/organisms/ConfirmPasswordInput";
import PhoneInput from "../components/organisms/PhoneInput";
import CodeVerificationInput from "../components/organisms/PhoneVerification";
import NicknameInput from "../components/organisms/NicknameInput";
import Button from "../components/atoms/Button";
import { router } from "expo-router";
import { useSignUp } from "../hooks/useSignUp";
import type { AxiosError } from "axios";

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") {
    // 브라우저 기본 alert 사용
    window.alert(text);
  } else {
    Alert.alert(title, message);
  }
};

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  // 연동 코드
  const { submit, loading, error } = useSignUp();

  const handleSignUp = async () => {
    if (
      !email ||
      !emailDomain ||
      !password ||
      !confirmPassword ||
      !phone ||
      !nickname
    ) {
      showAlert("필수 입력이 비었습니다.");
      console.log("필수 입력이 비었습니다.");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.");
      console.log("비밀번호가 일치하지 않습니다.");
      return;
    }

    const fullEmail = `${email}@${emailDomain}`;

    try {
      await submit({
        email: fullEmail,
        password,
        confirmPassword,
        phoneNumber: phone,
        nickname,
        agreeMarketing: true,
        agreeThirdParty: false,
      });

      showAlert("회원가입 성공", "이제 로그인해주세요!");
      console.log("회원가입 성공");
      router.push("/signUpAgree");
    } catch (e: any) {
      if (e.response) {
        const code = e.response?.data?.code as number | undefined;
        const message = e.response?.data?.message as string | undefined;

        if (code === 400 && message) {
          if (message.includes("이미 존재하는 이메일")) {
            showAlert("이미 존재하는 이메일입니다.");
            console.log("이미 존재하는 이메일입니다.");
          } else if (message.includes("재확인 비밀번호")) {
            showAlert("비밀번호가 일치하지 않습니다.");
            console.log("비밀번호가 일치하지 않습니다.");
          } else if (message.includes("이미 존재하는 전화번호")) {
            showAlert("이미 존재하는 전화번호입니다.");
            console.log("이미 존재하는 전화번호입니다.");
          }
        }
      }
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          회원가입
        </Text>

        <View style={{ marginBottom: 20 }}>
          <EmailInput
            email={email}
            emailDomain={emailDomain}
            onChangeEmail={setEmail}
            onChangeEmailDomain={setEmailDomain}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <PasswordInput password={password} onChangePassword={setPassword} />
        </View>

        <View style={{ marginBottom: 20 }}>
          <ConfirmPasswordInput
            confirmPassword={confirmPassword}
            onChangeConfirmPassword={setConfirmPassword}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <PhoneInput
            phone={phone}
            onChangePhone={setPhone}
            onPressSendCode={() => {}}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <CodeVerificationInput
            code={code}
            onChangeCode={setCode}
            onPressVerify={() => {}}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <NicknameInput nickname={nickname} onChangeNickname={setNickname} />
        </View>

        <Button
          text="다음으로"
          onPress={handleSignUp}
          isPressed={isPressed}
          variant="submit"
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
