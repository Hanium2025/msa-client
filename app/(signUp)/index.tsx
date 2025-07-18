import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, Text } from "react-native";
import EmailInput from "../components/organisms/EmailInput";
import PasswordInput from "../components/organisms/PasswordInput";
import ConfirmPasswordInput from "../components/organisms/ConfirmPasswordInput";
import PhoneInput from "../components/organisms/PhoneInput";
import CodeVerificationInput from "../components/organisms/PhoneVerification";
import NicknameInput from "../components/organisms/NicknameInput";
import SubmitButton from "../components/atoms/SubmitButton";
import { router } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPressed, setIsPressed] = useState(false);

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

        <SubmitButton
          text="다음으로"
          onPress={() => router.push("/signUpAgree")}
          isPressed={isPressed}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
