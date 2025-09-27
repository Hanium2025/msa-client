// app/components/organisms/PaymentWidget.web.tsx
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
import { useTempSavePayment } from "../../hooks/useTempSavePayment";

type Props = {
  amount?: number;        // 결제 금액(원)
  customerKey?: string;   // 고객 식별자
  orderId?: string;       // 주문번호(없으면 내부에서 생성하여 고정)
  orderName?: string;     // 주문명
  successUrl?: string;    // 결제 성공 리다이렉트 URL
  failUrl?: string;       // 결제 실패/취소 리다이렉트 URL
};

const PRIMARY = "#0F5965";

export default function PaymentWidget({
  amount = 50_000,
  customerKey = "customer_123",
  orderId,
  orderName = "피키 유아용품",
}: Props) {
  // 웹이 아니면 렌더하지 않음
  if (Platform.OS !== "web") return null;

  const insets = useSafeAreaInsets();
  const safeBottom = (insets?.bottom ?? 0) + 8;

  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;

  // API 베이스 URL (여러 키 지원)
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.EXPO_PUBLIC_API_BASE;
  // PaymentWidget.web.tsx
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const successUrl = process.env.EXPO_PUBLIC_TOSS_SUCCESS_URL ?? `${origin}/success`;
  const failUrl = process.env.EXPO_PUBLIC_TOSS_FAIL_URL ?? `${origin}/fail`;


  // temp-save 훅
  const { mutateAsync: tempSave } = useTempSavePayment({ baseUrl: apiBaseUrl });

  // orderId는 최초 한 번만 생성/고정
  const orderRef = useRef<string>(orderId ?? `ORDER-${Date.now()}`);

  const methodsId = "toss-payment-methods";
  const agreementId = "toss-payment-agreement";

  const paymentWidgetRef = useRef<any>(null);
  const [pmControl, setPmControl] = useState<any>(null);
  const [agControl, setAgControl] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // 위젯 로드 + 렌더
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!clientKey) throw new Error("EXPO_PUBLIC_TOSS_CLIENT_KEY 가 설정되지 않았습니다.");

        const { loadPaymentWidget } = await import("@tosspayments/payment-widget-sdk");

        // 한 프레임 대기하여 DOM 보장
        await new Promise((r) => requestAnimationFrame(() => r(null)));

        if (!document.querySelector(`#${methodsId}`) || !document.querySelector(`#${agreementId}`)) {
          throw new Error("결제 컨테이너 DOM(#toss-payment-*)를 찾지 못했습니다.");
        }

        const pw = await loadPaymentWidget(clientKey, customerKey);
        if (!mounted) return;

        paymentWidgetRef.current = pw;

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
    // clientKey / customerKey 변경 시만 재로딩
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientKey, customerKey]);

  // 금액 변경 시 위젯 금액 업데이트
  useEffect(() => {
    if (!pmControl) return;
    try {
      const ret = pmControl.updateAmount(amount);
      if (ret && typeof (ret as any).catch === "function") {
        (ret as any).catch((e: any) => console.warn("updateAmount error:", e));
      }
    } catch (e) {
      console.warn("updateAmount threw:", e);
    }
  }, [amount, pmControl]);

  // 페이지 로드/금액 변경 시 서버에 "임시 저장" (fire & forget)
  useEffect(() => {
    const oid = orderRef.current;
    const amt = Number(amount ?? 0);
    if (!oid || !amt) return;
    tempSave({ orderId: oid, amount: amt }).catch((e) => {
      console.warn("tempSave failed:", e);
    });
  }, [amount, tempSave]);

  // 버튼 클릭 시엔 즉시 결제 요청만 호출 (user gesture 유지)
  const handleRequestPay = () => {

    if (!paymentWidgetRef.current) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }

    paymentWidgetRef.current.requestPayment({
      orderId: orderRef.current,
      orderName,
      successUrl,
      failUrl,
    })
      .catch((e: any) => {
        Alert.alert("결제 요청 실패", String(e?.message ?? e));
      });
  };

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      {/* RN Web에서 selector 인식 안정화를 위해 id/nativeID 모두 지정 */}
      {/* @ts-ignore */}
      <View id={methodsId} nativeID={methodsId} style={styles.methods} />
      {/* @ts-ignore */}
      <View id={agreementId} nativeID={agreementId} style={styles.agreement} />

      <View style={[styles.footer, { paddingBottom: safeBottom }]}>
        {/* user gesture 유지: disabled는 ready만 기준 */}
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

      {/* 하단 잘림 방지용 스페이서 */}
      <View style={{ height: 12 }} />
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
    width: "100%",
    marginTop: 16,
    position: "relative",
    zIndex: 1,
  },
  footer: {
    position: "relative",
    zIndex: 10,
    marginTop: 12,
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
