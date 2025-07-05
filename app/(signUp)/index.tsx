import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>회원가입</Text>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.inlineInputWrapper}>
              <TextInput
                style={[styles.inlineInput, { flex: 2 }]}
                placeholder="이메일 입력"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
              />
              <Text style={styles.atSymbol}>@</Text>
              <TextInput
                style={[styles.inlineInput, { flex: 1 }]}
                placeholder="선택"
                value={emailDomain}
                onChangeText={setEmailDomain}
                placeholderTextColor="#ccc"
              />
              <Ionicons
                name="chevron-down"
                size={16}
                color="#aaa"
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.underlineInput, { flex: 1 }]}
              placeholder="비밀번호 입력 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={[styles.underlineInput, { flex: 1 }]}
              placeholder="비밀번호 재입력"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>전화번호</Text>
            <View style={styles.rowWithButton}>
              <TextInput
                style={[styles.underlineInput, { flex: 1 }]}
                placeholder="전화번호 입력"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.buttonText}>인증</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>인증번호</Text>
            <View style={styles.rowWithButton}>
              <TextInput
                style={[styles.underlineInput, { flex: 1 }]}
                placeholder="인증번호 입력"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.rowLabelWithInput}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[styles.underlineInput, { flex: 1 }]}
              placeholder="닉네임 입력"
              value={nickname}
              onChangeText={setNickname}
              placeholderTextColor="#ccc"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isPressed && styles.submitButtonPressed]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => router.push("/signUpAgree")}
        >
          <Text style={styles.submitText}>다음으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    width: 100,
  },
  rowLabelWithInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
  },
  inlineInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inlineInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
  },
  atSymbol: {
    marginHorizontal: 4,
    fontSize: 16,
    color: "#000",
  },
  rowWithButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
    borderColor: "#084C63", // 테두리 색
    borderWidth: 1, // 테두리 두께 추가
    shadowColor: "#000", // 그림자
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#084C63",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 24,
    width: 313,
    height: 57,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderColor: "rgba(217, 217, 217, 0.80)", // 테두리 색
    borderWidth: 1, // 테두리 두께 추가
    shadowColor: "rgba(0, 0, 0, 0.08)", // 그림자
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  submitText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    elevation: 3,
    paddingVertical: 8,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  submitButtonPressed: {
    backgroundColor: "084C63",
  },
});
