import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Alert,
  Platform,
  StyleSheet,
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
import { useSendSmsCode } from "../hooks/useSendSmsCode";
import { useVerifySmsCode } from "../hooks/useVerifySmsCode";

const PHONE_WIDTH = 390; // iPhone width

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
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

  const { submit, loading } = useSignUp();
  const { send: sendCode } = useSendSmsCode();
  const { verify: verifyCode } = useVerifySmsCode();
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleSendCode = async () => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!cleaned) return showAlert("알림", "전화번호를 입력해 주세요.");
    try {
      const { message } = await sendCode(cleaned);
      showAlert("인증번호 발송", message ?? "메시지 발송 완료");
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "인증번호 발송에 실패했습니다.";
      showAlert("발송 실패", msg);
    }
  };

  const handleVerifyCode = async () => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (!cleaned || !code.trim())
      return showAlert("알림", "전화번호와 인증번호를 입력해 주세요.");
    try {
      const { message } = await verifyCode(cleaned, code.trim());
      setIsPhoneVerified(true);
      showAlert("인증 성공", message ?? "인증번호 확인되었습니다.");
    } catch (e: any) {
      setIsPhoneVerified(false);
      const msg = e?.response?.data?.message ?? "인증번호 확인에 실패했습니다.";
      showAlert("인증 실패", msg);
    }
  };

  const handleSignUp = async () => {
    if (
      !email ||
      !emailDomain ||
      !password ||
      !confirmPassword ||
      !phone ||
      !nickname
    ) {
      return showAlert("필수 입력이 비었습니다.");
    }
    if (password !== confirmPassword) {
      return showAlert("비밀번호가 일치하지 않습니다.");
    }
    const passwordFormat =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!passwordFormat.test(password)) {
      return showAlert(
        "비밀번호 형식 오류",
        "비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다."
      );
    }
    if (!isPhoneVerified) {
      return showAlert(
        "휴대폰 인증이 필요합니다.",
        "인증번호 확인 후 다시 시도해 주세요."
      );
    }

    const fullEmail = `${email}@${emailDomain}`;

    try {
      await submit({
        email: fullEmail,
        password,
        confirmPassword,
        phoneNumber: phone.replace(/[^0-9]/g, ""),
        nickname,
        agreeMarketing: true,
        agreeThirdParty: false,
      });
      router.push("/signUpAgree");
    } catch (e: any) {
      const code = e?.response?.data?.code as number | undefined;
      const message = e?.response?.data?.message as string | undefined;
      if (code === 400 && message) {
        if (message.includes("이미 존재하는 이메일"))
          showAlert("이미 존재하는 이메일입니다.");
        else if (message.includes("재확인 비밀번호"))
          showAlert("비밀번호가 일치하지 않습니다.");
        else if (message.includes("이미 존재하는 전화번호"))
          showAlert("이미 존재하는 전화번호입니다.");
      }
    }
  };

  return (
    // ✅ 바깥: 웹에서는 배경/가운데 정렬
    <View style={styles.webRoot}>
      {/* ✅ 폰 프레임: 웹에서만 폭 390 고정 */}
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>회원가입</Text>

          <View style={styles.section}>
            <EmailInput
              email={email}
              emailDomain={emailDomain}
              onChangeEmail={setEmail}
              onChangeEmailDomain={setEmailDomain}
            />
          </View>

          <View style={styles.section}>
            <PasswordInput password={password} onChangePassword={setPassword} />
          </View>

          <View style={styles.section}>
            <ConfirmPasswordInput
              confirmPassword={confirmPassword}
              onChangeConfirmPassword={setConfirmPassword}
            />
          </View>

          <View style={styles.section}>
            <PhoneInput
              phone={phone}
              onChangePhone={setPhone}
              onPressSendCode={handleSendCode}
            />
          </View>

          <View style={styles.section}>
            <CodeVerificationInput
              code={code}
              onChangeCode={setCode}
              onPressVerify={handleVerifyCode}
            />
          </View>

          <View style={styles.section}>
            <NicknameInput nickname={nickname} onChangeNickname={setNickname} />
          </View>

          <Button
            style={{ marginTop: 100 }}
            text={loading ? "처리 중..." : "다음으로"}
            onPress={handleSignUp}
            isPressed={isPressed}
            variant="submit"
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            disabled={loading}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  section: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
});
