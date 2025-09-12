import React, { useEffect, useState } from "react";
import { View, Button, Alert, StyleSheet, Platform } from "react-native";
import {
  PaymentWidgetProvider,
  usePaymentWidget,
  AgreementWidget,
  PaymentMethodWidget,
} from "@tosspayments/widget-sdk-react-native";
import type {
  AgreementWidgetControl,
  PaymentMethodWidgetControl,
} from "@tosspayments/widget-sdk-react-native";

type Props = {
  amount?: number;                 // 결제 금액(원)
  customerKey?: string;            // 고객 식별자(테스트는 자유 문자열)
  orderId?: string;                // 주문번호(없으면 자동 생성)
  orderName?: string;              // 주문명
  successUrlNative?: string;       // 결제 성공 콜백 (딥링크/URL)
  failUrlNative?: string;          // 결제 실패/취소 콜백
};

export default function PaymentWidget({
  amount = 50_000,
  customerKey = "customer_123",
  orderId,
  orderName = "피키 유아용품",
  successUrlNative = process.env.EXPO_PUBLIC_TOSS_SUCCESS_URL_NATIVE ?? "https://example.com/payments/success",
  failUrlNative = process.env.EXPO_PUBLIC_TOSS_FAIL_URL_NATIVE ?? "https://example.com/payments/fail",
}: Props) {
  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    // 빌드 타임에 주입 안 됐을 때 방어
    console.warn("EXPO_PUBLIC_TOSS_CLIENT_KEY가 설정되어 있지 않습니다.");
  }

  return (
    <PaymentWidgetProvider clientKey={clientKey!} customerKey={customerKey}>
      <CheckoutPage
        amount={amount}
        orderId={orderId}
        orderName={orderName}
        successUrlNative={successUrlNative}
        failUrlNative={failUrlNative}
      />
    </PaymentWidgetProvider>
  );
}

function CheckoutPage({
  amount,
  orderId,
  orderName,
  successUrlNative,
  failUrlNative,
}: {
  amount: number;
  orderId?: string;
  orderName: string;
  successUrlNative: string;
  failUrlNative: string;
}) {
  const paymentWidget = usePaymentWidget();
  const [pmControl, setPmControl] = useState<PaymentMethodWidgetControl | null>(null);
  const [agControl, setAgControl] = useState<AgreementWidgetControl | null>(null);

  // 금액이 바뀌면 결제수단 위젯 금액 업데이트
  useEffect(() => {
    if (pmControl) {
      pmControl.updateAmount(amount).catch((e) => console.warn(e));
    }
  }, [amount, pmControl]);

  const onRequestPay = async () => {
    try {
      if (!paymentWidget || !agControl) {
        Alert.alert("주문 정보가 초기화되지 않았습니다.");
        return;
      }
      const ag = await agControl.getAgreementStatus();
      if (!ag?.agreedRequiredTerms) {
        Alert.alert("약관에 동의하지 않았습니다.");
        return;
      }
      await paymentWidget.requestPayment?.({
        orderId: orderId ?? `ORDER-${Date.now()}`,
        orderName,
        successUrl: successUrlNative, // 네이티브에선 딥링크/URL
        failUrl: failUrlNative,
      });
    } catch (e: any) {
      console.error(e);
      Alert.alert("결제 요청 실패", String(e?.message ?? e));
    }
  };

  const onShowSelected = async () => {
    if (!pmControl) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }
    const sel = await pmControl.getSelectedPaymentMethod();
    Alert.alert(`선택된 결제수단: ${JSON.stringify(sel)}`);
  };

  const onUpdateAmount = async () => {
    if (!pmControl) {
      Alert.alert("주문 정보가 초기화되지 않았습니다.");
      return;
    }
    await pmControl.updateAmount(100_000);
    Alert.alert("결제 금액이 100000원으로 변경되었습니다.");
  };

  return (
    <View style={styles.wrapper}>
      {/* 내부 WebView에 위젯을 렌더링하므로 selector만 맞춰주면 됩니다 */}
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidget
            ?.renderPaymentMethods("payment-methods", { value: amount }, { variantKey: "DEFAULT" })
            .then((ctl) => setPmControl(ctl))
            .catch((e) => console.warn(e));
        }}
      />
      <AgreementWidget
        selector="agreement"
        onLoadEnd={() => {
          paymentWidget
            ?.renderAgreement("agreement", { variantKey: "DEFAULT" })
            .then((ctl) => setAgControl(ctl))
            .catch((e) => console.warn(e));
        }}
      />

      <View style={styles.buttons}>
        <Button title="결제요청" onPress={onRequestPay} />
        <Button title="선택된 결제수단" onPress={onShowSelected} />
        <Button title="결제 금액 변경(→100000원)" onPress={onUpdateAmount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  buttons: { gap: 8, marginTop: 16 },
});
