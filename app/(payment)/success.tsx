// app/(payment)/success.tsx
import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Alert, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConfirmPayment, getChatroomIdFromConfirm } from "../hooks/useConfirmPayment";

export default function PaymentSuccess() {
  const router = useRouter();
  const { paymentKey, orderId, amount, tradeId } = useLocalSearchParams<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    tradeId?: string;
  }>();

  const { mutateAsync: confirm, isPending } = useConfirmPayment();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        console.log("[success query]", { paymentKey, orderId, amount, tradeId });

        if (!paymentKey || !orderId || !amount) {
          Alert.alert("결제 승인 불가", "필수 파라미터가 없습니다.");
          router.replace("/fail");
          return;
        }

        const payload = {
          paymentKey: String(paymentKey),
          orderId: String(orderId),
          amount: Number(amount),
          ...(tradeId ? { tradeId: Number(tradeId) } : {}),
        };

        console.log("[confirm payload]", payload);

        const res = await confirm(payload);
        const chatroomId = getChatroomIdFromConfirm(res);

        if (chatroomId) router.replace(`/chat/${chatroomId}`);
        else {
          Alert.alert("처리 완료", "결제 승인되었습니다.");
          router.replace("/chat");
        }
      } catch (e: any) {
        Alert.alert("결제 승인 실패", String(e?.message ?? e));
        router.replace("/fail");
      }
    })();
  }, [paymentKey, orderId, amount, tradeId, confirm, router]);

  return (
    <View style={s.wrap}>
      <ActivityIndicator />
      <Text style={s.text}>{isPending ? "결제 승인 처리 중입니다…" : "처리 중입니다…"}</Text>
      <Pressable onPress={() => router.replace("/")} style={s.btn}>
        <Text style={s.btnText}>홈으로</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  text: { fontSize: 14, color: "#333", textAlign: "center" },
  btn: { marginTop: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#0F5965", borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "700" },
});
