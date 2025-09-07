import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import Button from "../components/atoms/Button";
import TermRow from "../components/molecules/TermRow";
import TermRowAgree from "../components/organisms/AgreementForm";
import { router } from "expo-router";

export default function SignUpAgreeScreen() {
  const terms = [
    { id: 0, label: "[필수] ‘서비스명’ 이용약관" },
    { id: 1, label: "[필수] 개인정보 수집 및 이용" },
    { id: 2, label: "개인정보 제 3자 제공 동의" },
    { id: 3, label: "마케팅 정보 수신 동의" },
  ];

  const [checkedItems, setCheckedItems] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [agreeAll, setAgreeAll] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isSubmitEnabled = () =>
    (checkedItems[0] && checkedItems[1]) || agreeAll;

  const toggleItem = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
    setAgreeAll(updated.every(Boolean));
  };

  const toggleAll = () => {
    const newValue = !agreeAll;
    setAgreeAll(newValue);
    setCheckedItems(Array(terms.length).fill(newValue));
  };

  const handleSubmit = () => {
    if (isSubmitEnabled()) {
      if (Platform.OS === "web") {
        window.alert("회원가입이 완료되었습니다. 로그인해주세요!");
      } else {
        Alert.alert("회원가입 완료", "로그인해주세요!");
      }
      console.log("회원가입 완료");

      router.push("/(login)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.description}>이용약관 동의가 필요해요</Text>

        {terms.map((term, index) => (
          <TermRow
            key={term.id}
            label={term.label}
            checked={checkedItems[index]}
            onPress={() => toggleItem(index)}
          />
        ))}

        <TermRowAgree checked={agreeAll} onPress={toggleAll} />

        <Button
          text="회원가입 완료"
          onPress={handleSubmit}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          variant="signUpComplete"
          isPressed={isPressed}
          disabled={!isSubmitEnabled()}
        />
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
  description: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(60, 60, 67, 0.60)",
    marginBottom: 16,
  },
});
