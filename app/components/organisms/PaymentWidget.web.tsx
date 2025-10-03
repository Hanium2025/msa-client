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

type Props = {
  amount?: number;        
  customerKey?: string;  
  orderId?: string;      
  orderName?: string;     
  successUrl?: string;     
  tradeId?: number;      
};

const PRIMARY = "#0F5965";

export default function PaymentWidget({
  amount = 50_000,
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

  // base success/fail URL
  const baseSuccess = successUrlProp ?? process.env.EXPO_PUBLIC_TOSS_SUCCESS_URL ?? `${origin}/success`;
  const failUrl = failUrlProp ?? process.env.EXPO_PUBLIC_TOSS_FAIL_URL ?? `${origin}/fail`;

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

  const orderRef = useRef<string>(orderId ?? `ORDER-${Date.now()}`);

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
        if (!clientKey) throw new Error("EXPO_PUBLIC_TOSS_CLIENT_KEY is not set.");

        const { loadPaymentWidget } = await import("@tosspayments/payment-widget-sdk");

        await new Promise((r) => requestAnimationFrame(() => r(null)));

        if (!document.querySelector(`#${methodsId}`) || !document.querySelector(`#${agreementId}`)) {
          throw new Error("Cannot find widget containers (#toss-payment-*).");
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
    
  }, [clientKey, customerKey]);

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

  useEffect(() => {
    const oid = orderRef.current;
    const amt = Number(amount ?? 0);
    if (!oid || !amt) return;
    tempSave({ orderId: oid, amount: amt }).catch((e) => {
      console.warn("tempSave failed:", e);
    });
  }, [amount, tempSave]);

  const handleRequestPay = () => {
    if (!paymentWidgetRef.current) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }

    console.log("[requestPayment]",
  { orderId: orderRef.current, amount, orderName, successUrl, failUrl }
);
    paymentWidgetRef.current
      .requestPayment({
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

      {/* @ts-ignore */}
      <View id={methodsId} nativeID={methodsId} style={styles.methods} />
      {/* @ts-ignore */}
      <View id={agreementId} nativeID={agreementId} style={styles.agreement} />

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
