import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../components/atoms/Button";
import { TransactionReviewForm } from "../components/organisms/TransactionReviewForm";
import { ConfirmModal } from "../components/molecules/Modal";
import { useTradeReview } from "../hooks/useTradeReview";

const PHONE_WIDTH = 390;

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function TransactionReviewScreen() {
  const router = useRouter();
  const { tradeId } = useLocalSearchParams<{ tradeId?: string }>();

  // 별점/상세평가 로컬 상태
  const [rating, setRating] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");

  // 거래평가 API 훅 (전역 토큰 자동 사용)
  const { submit, loading, error, successMessage, reset } = useTradeReview();

  // 모달창
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 제출 버튼 → 확인 모달 → 실제 제출
  const doSubmit = async () => {
    if (!tradeId) {
      showAlert("오류", "유효하지 않은 거래입니다. (tradeId가 없습니다)");
      setConfirmOpen(false);
      return;
    }
    if (!rating) {
      showAlert("안내", "별점을 선택해주세요.");
      setConfirmOpen(false);
      return;
    }
    if (!detail.trim()) {
      showAlert("안내", "상세 평가를 작성해주세요.");
      setConfirmOpen(false);
      return;
    }

    setConfirmOpen(false);
    reset();

    // tradeId 타입 안전 처리
    const id = Number(tradeId);
    if (!Number.isFinite(id)) {
      showAlert("오류", "tradeId가 올바르지 않습니다.");
      return;
    }

    await submit(id, { rating, comment: detail });
  };

  // 성공/실패 결과 알림 및 이동은 상태 변화 감지로 처리
  useEffect(() => {
    if (error) {
      showAlert("오류", error);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      showAlert("완료", successMessage);
      router.back(); // 필요 시 완료 화면으로 이동하도록 교체 가능
    }
  }, [successMessage, router]);

  return (
    <SafeAreaView style={s.phoneFrame}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 카드 */}
        <View style={s.card}>
          <Text style={s.title}>이번 거래는 어떠셨나요?</Text>
          <Text style={s.desc}>
            거래 평가를 통해 상대방과 자신의 프로필 신뢰도가 업데이트돼요.
            완료된 상태의 거래 과정 전반에서의 느낌을 솔직하게 평가해주세요!
          </Text>

          {/* 거래 평가 폼 */}
          <TransactionReviewForm
            rating={rating}
            onChangeRating={setRating}
            detail={detail}
            onChangeDetail={setDetail}
          />
        </View>

        {/* 제출 버튼 */}
        <View style={{ alignItems: "center" }}>
          <Button
            variant="reportSubmit"
            text={loading ? "제출 중..." : "평가 제출"}
            onPress={() => setConfirmOpen(true)}
            disabled={!rating || !detail.trim() || loading}
            style={{ width: 219 }}
          />
        </View>

        <ConfirmModal
          visible={confirmOpen}
          title="평가를 제출할까요?"
          cancelText="취소"
          confirmText={loading ? "제출 중..." : "제출"}
          onClose={() => !loading && setConfirmOpen(false)}
          onConfirm={loading ? () => {} : doSubmit}
        />
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
    marginTop: 40,
    marginBottom: 24,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#000", marginBottom: 6 },
  desc: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
    lineHeight: 18,
    marginTop: 12,
  },
});
