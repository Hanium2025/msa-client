// app/(report)/index.tsx (또는 현재 파일)
import React, { useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView,
  Platform, Alert, Pressable, Image
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../components/atoms/Button";
import { ReportForm } from "../components/organisms/ReportForm";
import { useReportProduct } from "../hooks/useReportProduct"; 

const PHONE_WIDTH = 390;
const BACK_ICON = require("../../assets/images/back.png");

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function ReportScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  const { mutateAsync, isPending } = useReportProduct();

  const handleSubmit = async () => {
    if (!productId) {
      showAlert("오류", "상품 정보가 없습니다.");
      return;
    }
    try {
      const res = await mutateAsync({
        productId,
        reasonDisplay: reason,
        details: detail,
      });
      if (res?.code === 200) {
        router.push({ pathname: "/reportSuccess", params: { reason, detail,productId: String(productId) } });
      } else {
        showAlert("신고 실패", res?.message ?? "잠시 후 다시 시도해주세요.");
      }
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        (status === 400
          ? "입력할 수 있는 신고 사유 범위가 아닙니다."
          : status === 404
          ? "해당하는 상품을 찾을 수 없습니다."
          : "잠시 후 다시 시도해주세요.");
      showAlert("신고 실패", msg);
    }
  };

  return (
    <SafeAreaView style={s.phoneFrame}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.backBtn}>
          <Image source={BACK_ICON} style={s.backIcon} resizeMode="contain" />
        </Pressable>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <Text style={s.title}>보시는 상품에 문제가 있나요?</Text>
          <Text style={s.desc}>
            해당 상품이 서비스의 이용 규칙이나 공공 질서에 어긋난다고 판단되는 경우, 신고를 통해 알려주세요. 신고가 누적된 상품 판매자는 서비스 이용에 제재를 가할 수 있습니다.
          </Text>

          <ReportForm
            reason={reason}
            onChangeReason={setReason}
            detail={detail}
            onChangeDetail={setDetail}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Button
            variant="reportSubmit"
            text={isPending ? "제출 중..." : "신고 제출"}
            onPress={handleSubmit}
            disabled={!reason || !detail.trim() || isPending}
            style={{ width: 219 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  backBtn: { paddingVertical: 6, paddingRight: 6 },
  backIcon: { width: 16, height: 16 },
  card: {
    width: PHONE_WIDTH - 32,
    minHeight: 560,
    alignSelf: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    marginTop: -10,
    marginBottom: 24,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#000", marginBottom: 6 },
  desc: { fontSize: 12, fontWeight: "400", color: "#000", lineHeight: 18, marginTop: 12 },
});
