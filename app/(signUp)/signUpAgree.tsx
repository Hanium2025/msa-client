import React, { use, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SignupScreen() {
  const [checkedItems, setCheckedItems] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [agreeAll, setAgreeAll] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isRequiredChecked = () => checkedItems[0] && checkedItems[1];

  const terms = [
    { id: 0, label: "[필수] ‘서비스명’ 이용약관" },
    { id: 1, label: "[필수] 개인정보 수집 및 이용" },
    { id: 2, label: "개인정보 제 3자 제공 동의" },
    { id: 3, label: "마케팅 정보 수신 동의" },
  ];

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.etc}>이용약관 동의가 필요해요</Text>

        {terms.map((term, index) => (
          <TouchableOpacity
            key={term.id}
            style={styles.termRow}
            onPress={() => toggleItem(index)}
          >
            <Ionicons
              name={
                checkedItems[index] ? "checkmark-circle" : "ellipse-outline"
              }
              size={20}
              color="#084C63"
              style={styles.icon}
            />
            <Text style={styles.termText}>{term.label}</Text>
            <View style={styles.flexSpacer} />
            <Text style={styles.seeAll}>전체보기</Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.termRow} onPress={toggleAll}>
          <Ionicons
            name={agreeAll ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color="#084C63"
            style={styles.icon}
          />
          <Text style={[styles.termText, { fontWeight: "bold" }]}>
            전체 동의하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isRequiredChecked() && { opacity: 0.4 },
          ]}
          onPress={() => {
            if (isRequiredChecked()) router.push("/signUpAgree");
          }}
          disabled={!isRequiredChecked()}
        >
          <Text style={styles.submitText}>회원가입 완료</Text>
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
  etc: {
    fontSize: 13,
    fontWeight: 400,
    color: "rgba(60, 60, 67, 0.60)",
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 12,
  },
  termText: {
    fontSize: 14,
    color: "#000",
  },
  seeAll: {
    fontSize: 12,
    color: "#999",
    marginRight: 4,
  },
  flexSpacer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#084C63",
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
    color: "#fff",
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
