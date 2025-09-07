import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/atoms/Button";

const PHONE_WIDTH = 390;

export default function ReportCompleteScreen() {
  const router = useRouter();

  const backToProduct = () => {
    router.back();
  };

  const goHome = () => {
    router.replace("/(home)");
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.phone}>
        <View style={s.content}>
          <Text style={s.title}>신고가 접수되었습니다.</Text>
        </View>

        <View style={s.bottom}>
          <Button
            variant="reportToProduct"
            text="보던 상품으로 돌아가기"
            onPress={backToProduct}
          />
          <Button variant="reportToHome" text="홈으로" onPress={goHome} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  phone: {
    flex: 1,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
  },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  bottom: { paddingHorizontal: 16, paddingBottom: 20 },
});
