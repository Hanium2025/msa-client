import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "./LoginButton.style";

interface Props {
  isPressed: boolean;
  setIsPressed: (pressed: boolean) => void;
  onPress: () => void;
}

export default function LoginButton({
  isPressed,
  setIsPressed,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.loginButton, isPressed && styles.loginButtonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <Text style={styles.loginButtonText}>로그인</Text>
    </TouchableOpacity>
  );
}
