import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  amount?: number;              
  customerKey?: string;         
  orderId?: string;             
  orderName?: string;           
  successUrl?: string;          
  failUrl?: string;            
};

const PRIMARY = "#0F5965";


export default function PaymentWidget({
  amount = 50_000,
  customerKey = "customer_123",
  orderId,
  orderName = "피키 유아용품",
  successUrl = process.env.EXPO_PUBLIC_TOSS_SUCCESS_URL ?? `${location.origin}/payments/success`,
  failUrl = process.env.EXPO_PUBLIC_TOSS_FAIL_URL ?? `${location.origin}/payments/fail`,
}: Props) {

  const insets = useSafeAreaInsets();
  const safeBottom = (insets?.bottom ?? 0) + 8;

  if (Platform.OS !== "web") return null;

  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
  const methodsId = "toss-payment-methods";
  const agreementId = "toss-payment-agreement";

  const paymentWidgetRef = useRef<any>(null);
  const [pmControl, setPmControl] = useState<any>(null);
  const [agControl, setAgControl] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!clientKey) {
          throw new Error("EXPO_PUBLIC_TOSS_CLIENT_KEY 가 설정되지 않았습니다.");
        }

        // 웹 SDK 동적 로드
        const { loadPaymentWidget } = await import("@tosspayments/payment-widget-sdk");

        const pw = await loadPaymentWidget(clientKey, customerKey);
        if (!mounted) return;

        paymentWidgetRef.current = pw;

        // 결제수단/약관 위젯 렌더
        const pm = await pw.renderPaymentMethods(
          `#${methodsId}`,
          { value: amount },
          { variantKey: "DEFAULT" }
        );
        const ag = await pw.renderAgreement(`#${agreementId}`, { variantKey: "DEFAULT" });

        if (!mounted) return;
        setPmControl(pm);
        setAgControl(ag);
        setReady(true);
      } catch (err: any) {
        console.error(err);
        Alert.alert("결제 위젯 초기화 실패", String(err?.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey]);

  const handleRequestPay = async () => {
    try {
      if (!paymentWidgetRef.current || !agControl) {
        Alert.alert("주문 정보가 초기화되지 않았습니다.");
        return;
      }
      const agreement = await agControl.getAgreementStatus();
      if (!agreement?.agreedRequiredTerms) {
        Alert.alert("약관에 동의하지 않았습니다.");
        return;
      }

      await paymentWidgetRef.current.requestPayment({
        orderId: orderId ?? `ORDER-${Date.now()}`,
        orderName,
        successUrl,
        failUrl,
      });
    } catch (err: any) {
      console.error(err);
      Alert.alert("결제 요청 실패", String(err?.message ?? err));
    }
  };

  const handleShowSelected = async () => {
    if (!pmControl) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }
    const selected = await pmControl.getSelectedPaymentMethod();
    Alert.alert(`선택된 결제수단: ${JSON.stringify(selected)}`);
  };

  const handleUpdateAmount = async () => {
    if (!pmControl) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }
    await pmControl.updateAmount(100_000);
    Alert.alert("결제 금액이 100000원으로 변경되었습니다.");
  };

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <View nativeID={methodsId} style={styles.methods} />
      <View nativeID={agreementId} style={styles.agreement} />

      <View style={[styles.footer, { paddingBottom: safeBottom }]}>
        <Pressable
          onPress={handleRequestPay}
          disabled={!ready}
          style={({ pressed }) => [
            styles.primaryBtn,
            !ready && { opacity: 0.5 },
            pressed && { transform: [{ translateY: 1 }] },
          ]}
        >
          <Text style={styles.primaryText}>결제하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  loading: { paddingVertical: 12 },
  methods: {
    minHeight: 420,
    width: "100%",
    position: "relative", 
    zIndex: 1,
  },
  agreement: {
    //minHeight: 140,
    width: "100%",
    marginTop: 16,
    position: "relative",
    zIndex: 1, 
  },
  footer: {
    position: "relative", 
    zIndex: 10, 
  },
  primaryBtn: {
    height: 56,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
