// app/components/organisms/PaymentWidget.web.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useVerifyPayment } from "../../hooks/useVerifyPayment";

type Props = {
  amount?: number;          // 결제 금액(원)
  customerKey?: string;     // 고객 식별자
  orderId?: string;         // 주문번호
  orderName?: string;       // 주문명
  successUrl?: string;      // 결제 성공 리다이렉트 URL
  failUrl?: string;         // 결제 실패 리다이렉트 URL
  tradeId?: number;         // 서버가 필요로 하는 거래 ID
};

const PRIMARY = "#0F5965";

export default function PaymentWidget({
  amount = 0,
  customerKey = "customer_123",
  orderId,
  orderName = "피키 유아용품",
  successUrl: successUrlProp,
  failUrl: failUrlProp,
  tradeId,
}: Props) {
  if (Platform.OS !== "web") return null;

  const insets = useSafeAreaInsets();
  const safeBottom = (insets?.bottom ?? 0) + 8;

  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.EXPO_PUBLIC_API_BASE;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const baseSuccess =
    successUrlProp ??
    process.env.EXPO_PUBLIC_TOSS_SUCCESS_URL ??
    `${origin}/success`;
  const failUrl =
    failUrlProp ?? process.env.EXPO_PUBLIC_TOSS_FAIL_URL ?? `${origin}/fail`;

  const successUrl = useMemo(() => {
    try {
      const u = new URL(baseSuccess, origin);
      if (tradeId != null) u.searchParams.set("tradeId", String(tradeId));
      return u.toString();
    } catch {
      const sep = baseSuccess.includes("?") ? "&" : "?";
      return tradeId != null ? `${baseSuccess}${sep}tradeId=${tradeId}` : baseSuccess;
    }
  }, [baseSuccess, tradeId, origin]);

  const { mutateAsync: tempSave } = useTempSavePayment({ baseUrl: apiBaseUrl });
  const { mutateAsync: verify } = useVerifyPayment({ baseUrl: apiBaseUrl });

  const orderRef = useRef<string>(orderId ?? `ORDER-${Date.now()}`);

  const methodsId = "toss-payment-methods";
  const agreementId = "toss-payment-agreement";

  const paymentWidgetRef = useRef<any>(null);
  const [pmControl, setPmControl] = useState<any>(null);
  const [agControl, setAgControl] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const savedOnceRef = useRef(false);

  // 초기 환경 로깅
  useEffect(() => {
    console.log("[env]", {
      clientKeyPresent: !!clientKey,
      apiBaseUrl,
      origin,
      baseSuccess,
      successUrl,
      failUrl,
      tradeId,
    });
  }, [clientKey, apiBaseUrl, origin, baseSuccess, successUrl, failUrl, tradeId]);

  // 1) 위젯 로드 + 렌더
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!clientKey) throw new Error("EXPO_PUBLIC_TOSS_CLIENT_KEY 가 설정되지 않았습니다.");

        const { loadPaymentWidget } = await import("@tosspayments/payment-widget-sdk");

        await new Promise((r) => requestAnimationFrame(() => r(null)));

        const methodsEl = document.querySelector(`#${methodsId}`);
        const agreementEl = document.querySelector(`#${agreementId}`);
        console.log("[widget:init] containers", {
          methodsEl: !!methodsEl,
          agreementEl: !!agreementEl,
        });
        if (!methodsEl || !agreementEl) {
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
        console.log("[widget] ready", {
          orderId: orderRef.current,
          amount,
          successUrl,
          failUrl,
        });
      } catch (err: any) {
        console.error("[widget:init] error:", err);
        Alert.alert("결제 위젯 초기화 실패", String(err?.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey, amount]);

  // 2) 금액 변경 시 위젯 금액 업데이트 + 로그
  useEffect(() => {
    console.log("[amount] changed", amount);
    if (!pmControl) return;
    try {
      const ret = pmControl.updateAmount(amount);
      if (ret && typeof (ret as any).catch === "function") {
        (ret as any).catch((e: any) => console.warn("[updateAmount] error:", e));
      }
    } catch (e) {
      console.warn("[updateAmount] threw:", e);
    }
    // 금액 바뀌면 다시 저장하도록 플래그 초기화
    savedOnceRef.current = false;
    setSaved(false);
  }, [amount, pmControl]);

  // 3) 임시 저장 선행 (조건/성공/실패 로그)
  useEffect(() => {
    console.log("[temp-save:cond]", {
      ready,
      amount,
      savedOnce: savedOnceRef.current,
    });
    const run = async () => {
      if (!ready) return;
      if (!amount || amount <= 0) return;
      if (savedOnceRef.current) return;

      try {
        const payload = { orderId: orderRef.current, amount: Number(amount) };
        console.log("[temp-save] try:", payload);
        await tempSave(payload);
        await verify(payload); // 서버가 verify 강제 시 필요
        savedOnceRef.current = true;
        setSaved(true);
        console.log("[temp-save] success");
      } catch (e: any) {
        console.error("[temp-save] failed:", e);
        setSaved(false);
        Alert.alert("결제 준비 실패", String(e?.message ?? e));
      }
    };
    run();
  }, [ready, amount, tempSave, verify]);

  // 4) 클릭 시 즉시 결제 요청
  const handleRequestPay = () => {
    if (!paymentWidgetRef.current) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }

    try {
      const st = agControl?.getAgreementStatus?.();
      console.log("[agreement]", st);
      if (st && st.agreedRequiredTerms === false) {
        Alert.alert("약관에 동의하지 않았습니다.");
        return;
      }
    } catch (e) {
      console.log("[agreement] skip check:", e);
    }

    console.log("[requestPayment]", {
      orderId: orderRef.current,
      amount,
      orderName,
      successUrl,
      failUrl,
    });

    paymentWidgetRef.current
      .requestPayment({
        orderId: orderRef.current,
        orderName,
        successUrl,
        failUrl,
      })
      .catch((e: any) => {
        console.error("[requestPayment] failed:", e);
        Alert.alert("결제 요청 실패", String(e?.message ?? e));
      });
  };

  const canPay = ready && saved && amount > 0;

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      {/* @ts-ignore */}
      <View id={methodsId} nativeID={methodsId} style={styles.methods} />
      {/* @ts-ignore */}
      <View id={agreementId} nativeID={agreementId} style={styles.agreement} />

      <View style={[styles.footer, { paddingBottom: safeBottom }]}>
        <Pressable
          onPress={handleRequestPay}
          disabled={!canPay}
          style={({ pressed }) => [
            styles.primaryBtn,
            !canPay && { opacity: 0.5 },
            pressed && { transform: [{ translateY: 1 }] },
          ]}
        >
          <Text style={styles.primaryText}>
            {saved ? "결제하기" : "결제 준비 중…"}
          </Text>
        </Pressable>
      </View>

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
