// app/(payment)/index.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Alert,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ShippingInfo from "../components/organisms/ShippingInfo";
import OrderInfo from "../components/molecules/OrderInfo";
import PaymentWidget from "../components/organisms/PaymentWidget";
import { useProductDetail } from "../hooks/useProductDetail";

type Option = "existing" | "new";

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

function toIntPrice(v: number | string): number {
  if (typeof v === "number") return Math.round(v);
  const cleaned = String(v).replace(/[^\d]/g, "");
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
}

export default function PaymentScreen() {
  const [shippingTab, setShippingTab] = useState<Option>("existing");

  // URL 예: /(payment)?productId=123&tradeId=45
  const { productId: pid, tradeId: tid } = useLocalSearchParams<{
    productId?: string;
    tradeId?: string;
  }>();

  const productId = useMemo(() => (pid ? Number(pid) : NaN), [pid]);
  const tradeId = useMemo(() => (tid ? Number(tid) : NaN), [tid]);

  const { data: product, isLoading, error } = useProductDetail(productId);

  // 화면에 실제 결제할 금액(상품가 + 배송비 등)
  const shippingFee = 0; // 서버에서 받는 구조면 해당 값으로 교체
  const productPrice = useMemo(() => (product ? toIntPrice(product.price) : 0), [product]);
  const computedAmount = useMemo(() => productPrice + shippingFee, [productPrice]);

  const [amount, setAmount] = useState(0);

  // 상품 정보를 받아오면 결제 금액 확정
  useEffect(() => {
    if (product) setAmount(computedAmount);
  }, [product, computedAmount]);

  // 필수 파라미터 가드
  if (!pid || !Number.isFinite(productId)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          <Text>잘못된 접근입니다. (productId 없음)</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (!tid || !Number.isFinite(tradeId)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          <Text>거래 식별자(tradeId)가 없습니다. 결제를 시작할 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.center]}>
          {showAlert("상품을 불러오지 못했습니다.", error?.message)}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.shippingInfo}>
            <ShippingInfo onTabChange={setShippingTab} />
          </View>

          {shippingTab === "existing" && (
            <>
              <OrderInfo
                title={product.title}
                // 아래 두 줄은 OrderInfo가 표시용일 뿐, 실제 결제 금액은 amount로 확정됨
                price={product.price}
                shippingFee={shippingFee}
                image={
                  product.images?.[0]?.imageUrl
                    ? { uri: product.images[0].imageUrl }
                    : undefined
                }
                sellerNickname={product.sellerNickname ?? ""}
                onAmountChange={setAmount}
              />

              {/* Toss에 표시/전달할 확정 금액과 tradeId를 넘김 */}
              <PaymentWidget
                amount={Number(amount)}                 // 반드시 숫자
                orderName={product.title}              // 주문명
                tradeId={Number(tradeId)}              // success URL에도 포함됨
              />
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, width: "100%", maxWidth: 393, alignSelf: "center" },
  center: { justifyContent: "center", alignItems: "center", padding: 24 },
  scroll: { flex: 1 },
  content: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 180, 
    gap: 40,
  },
  shippingInfo: { alignItems: "center", width: "100%", gap: 30 },
});
