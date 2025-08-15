// app/(addProduct)/detail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProductDetail } from "../hooks/useProductDetail";
import ProductCard from "../components/organisms/ProductCard";
import BottomButtonGroup from "../components/molecules/BottomButtonGroup";
import { tokenStore } from "../auth/tokenStore"; // 토큰 저장소에서 읽기

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function DetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string | string[] }>();

  const parsedId = Array.isArray(productId)
    ? Number(productId[0])
    : Number(productId);

  const [bootstrapped, setBootstrapped] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // 토큰 로드 + 유효성 체크
  useEffect(() => {
    let mounted = true;

    (async () => {
      // productId 유효성 먼저 확인
      if (!parsedId || Number.isNaN(parsedId)) {
        showAlert("오류", "잘못된 상품 ID 입니다.");
        router.replace("/(home)");
        return;
      }

      const t = await tokenStore.get();
      if (!mounted) return;

      if (!t) {
        showAlert("로그인이 필요합니다.");
        router.replace("/(login)");
        return;
      }

      setToken(t);
      setBootstrapped(true);
    })();

    return () => {
      mounted = false;
    };
  }, [parsedId, router]);

  if (!bootstrapped || !token) {
    // 토큰 확인/로드 중
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 토큰 준비가 끝났을 때만 훅을 사용하는 자식 컴포넌트 렌더
  return <DetailContent productId={parsedId} token={token} />;
}

function DetailContent({ productId, token }: { productId: number; token: string }) {
  const { data, isLoading, error } = useProductDetail(productId, token);

  const handleChat = () => {
    console.log("채팅하기 클릭");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data) {
    showAlert("오류", (error as any)?.message ?? "상품 정보를 불러오지 못했습니다.");
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red", marginBottom: 8 }}>
          {(error as any)?.message ?? "상품 정보를 불러오지 못했습니다."}
        </Text>
      </View>
    );
  }

  type ProductImage = { imageUrl: string };
  const images: ProductImage[] = Array.isArray(data.images)
    ? data.images
        .map((img: any) => ({ imageUrl: img?.imageUrl ?? "" }))
        .filter((i: ProductImage) => i.imageUrl)
    : [];

  const priceNum =
    typeof data.price === "number"
      ? data.price
      : Number(String(data.price ?? "0").replace(/[^\d]/g, ""));

  const statusMapped =
    data.status === "SELLING"
      ? "ON_SALE"
      : data.status === "IN_PROGRESS"
      ? "IN_PROGRESS"
      : "SOLD_OUT";

  const product = {
    title: data.title,
    price: priceNum,
    category: data.category,
    description: data.content,
    images,
    user: {
      nickname: "판매자",
      postedAt: "방금 전",
    },
    status: statusMapped as "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT",
    likeCount: 0,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProductCard product={product} />
        <BottomButtonGroup status={product.status} onChat={handleChat} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollContainer: { paddingBottom: 32 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
