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
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useProductDetail } from "../hooks/useProductDetail";
import ProductCard from "../components/organisms/ProductCard";
import BottomButtonGroup from "../components/molecules/BottomButtonGroup";
import { tokenStore } from "../auth/tokenStore";
import { useToggleLike } from "../hooks/useToggleLike";

const PHONE_WIDTH = 390; // iPhone 14 Pro width

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function DetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{
    productId?: string | string[];
  }>();

  const parsedId = Array.isArray(productId)
    ? Number(productId[0])
    : Number(productId);

  const [bootstrapped, setBootstrapped] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
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

  // 모든 상태를 폰 프레임 안에서 렌더
  if (!bootstrapped || !token) {
    return (
      <View style={styles.webRoot}>
        <SafeAreaView style={styles.phoneFrame}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <DetailContent productId={parsedId} token={token} />
      </SafeAreaView>
    </View>
  );
}

function DetailContent({
  productId,
  token,
}: {
  productId: number;
  token: string;
}) {
  const { data, isLoading, error } = useProductDetail(productId, token);
  const toggleLike = useToggleLike(productId, token);

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
    showAlert(
      "오류",
      (error as any)?.message ?? "상품 정보를 불러오지 못했습니다."
    );
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red", marginBottom: 8 }}>
          {(error as any)?.message ?? "상품 정보를 불러오지 못했습니다."}
        </Text>
      </View>
    );
  }

  const sellerId: number | undefined =
    (data as any).sellerId ?? (data as any).seller?.id;
  if (!sellerId) {
    console.warn("[detail] sellerId 없음 — createChatroom시 receiverId 필요");
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

  const initialLiked = data.liked ?? false;
  const initialLikeCount = data.likeCount ?? 0;

  const uiStatus: "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT" =
    data.status === "SELLING"
      ? "ON_SALE"
      : "IN_PROGRESS" === data.status
        ? "IN_PROGRESS"
        : "SOLD_OUT";

  const product = {
    title: data.title,
    price: priceNum,
    category: data.category,
    description: data.content,
    images,
    user: { nickname: data.sellerNickname ?? "판매자", postedAt: "방금 전" },
    status: uiStatus, // "SELLING" | "IN_PROGRESS" | "SOLD_OUT"
    liked: data.liked, // 서버 값 반영
    likeCount: data.likeCount,
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProductCard
          product={product}
          onToggleLike={async (nextLiked) => {
            // 예: useToggleLike(productId, token) 사용
            const res = await toggleLike.mutateAsync();
            // 서버가 count를 주면 { likeCount: res.data.count } 형태로 반환
            // return { likeCount: someNumber };
          }}
        />
        <BottomButtonGroup
          status={product.status}
          productId={productId}
          receiverId={sellerId}
          token={token}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // 웹에서 중앙 정렬 + 배경
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  // 아이폰 14 프로 프레임
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },

  // 내부 컨텐츠 레이아웃
  safeArea: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollContainer: { paddingBottom: 32 },

  // 상태 뷰들
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
