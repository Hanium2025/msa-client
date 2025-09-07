import React from "react";
import { View } from "react-native";
import styles from "./LoginForm.style";
import LoginInput from "../../atoms/LoginInput";

interface Props {
  email: string;
  password: string;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
}

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
}: Props) {
  return (
    <View style={styles.loginForm}>
      <LoginInput
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
      />
      <LoginInput
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  );
}
