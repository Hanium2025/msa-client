// app/(payment)/index.tsx
import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Alert,
  Platform,
  StyleSheet,
  ActivityIndicator,
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

export default function PaymentScreen() {
  const [shippingTab, setShippingTab] = useState<Option>("existing");

  // URL 예: /(payment)?productId=123&tradeId=45
  const { productId: pid, tradeId: tid } = useLocalSearchParams<{
    productId?: string;
    tradeId?: string;
  }>();

  const productId = useMemo(() => (pid ? Number(pid) : NaN), [pid]);
  const tradeId = useMemo(() => (tid ? Number(tid) : undefined), [tid]);

  const { data: product, isLoading, error } = useProductDetail(productId);
  const [amount, setAmount] = useState(0); // OrderInfo에서 총액을 올려줌

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: "center", padding: 24 }]}>
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
                price={product.price}
                shippingFee={0}
                image={
                  product.images?.[0]?.imageUrl
                    ? { uri: product.images[0].imageUrl }
                    : undefined
                }
                sellerNickname={product.sellerNickname ?? ""}
                onAmountChange={setAmount} // 총액을 PaymentWidget으로 전달
              />

              {/* tradeId 같이 넘겨서 success 페이지에서 confirm에 전달되게 함 */}
              <PaymentWidget
                amount={amount}
                orderName={product.title}
                tradeId={tradeId}
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
  scroll: { flex: 1 },
  content: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 180, 
    gap: 40,
  },
  shippingInfo: { alignItems: "center", width: "100%", gap: 30 },
});
