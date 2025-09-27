// app/payments/success.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConfirmPayment } from "../hooks/useConfirmPayment";

export default function PaymentSuccess() {
  const router = useRouter();
  const { paymentKey, orderId, amount, tradeId } = useLocalSearchParams<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    tradeId?: string; // 우리가 successUrl에 붙여 보낸 값
  }>();

  const { mutateAsync, isPending } = useConfirmPayment();

  useEffect(() => {
    (async () => {
      try {
        if (!paymentKey || !orderId || !amount || !tradeId) {
          Alert.alert("결제 승인 불가", "필수 파라미터가 없습니다.");
          return;
        }

        const res = await mutateAsync({
          paymentKey,
          orderId,
          amount: Number(amount),
          tradeId: Number(tradeId),
        });

        const chatroomId = res.data?.chatroomId;
        if (!chatroomId) {
          Alert.alert("처리 완료", "결제는 승인되었지만 채팅방 정보를 찾을 수 없습니다.");
          router.replace("/chat"); // 목록 등 안전한 경로
          return;
        }

        router.replace(`/chat/${chatroomId}`);
      } catch (e: any) {
        Alert.alert("결제 승인 실패", String(e?.message ?? e));
      }
    })();
  }, [paymentKey, orderId, amount, tradeId, mutateAsync, router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
