import React from "react";
import { Text, View } from "react-native";
import styles from "./SignUpPrompt.style";
import { router } from "expo-router";

export default function SignUpPrompt() {
  return (
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
  );
}
