// app/(addProduct)/detail.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator,
  Text, Alert, Platform, StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProductCard from "../components/organisms/ProductCard";
import BottomButtonGroup from "../components/molecules/BottomButtonGroup";        // 비작성자
import ProductOwnerActions from "../components/organisms/ProductOwnerActions";    // 작성자
import BottomTabBar from "../components/molecules/BottomTabBar";
import { tokenStore } from "../auth/tokenStore";
import { useProductDetail } from "../hooks/useProductDetail";
import { useToggleLike } from "../hooks/useToggleLike";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import type { ImageSourcePropType, ImageURISource } from "react-native";


const PHONE_WIDTH = 390;
const TABBAR_SPACE = 90;

const DEFAULT_AVATAR = require("../../assets/images/default_profile.png") as ImageSourcePropType;

function toImageSource(url?: string): ImageSourcePropType {
  return url ? ({ uri: url } as ImageURISource) : DEFAULT_AVATAR;
}

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

function mapStatusKToUI(k?: string): "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT" {
  switch (k) {
    case "판매 중": return "ON_SALE";
    case "예약 중": return "IN_PROGRESS";
    case "판매 완료": return "SOLD_OUT";
    default: return "ON_SALE";
  }
}

// "2025.08.26" 또는 ISO 문자열 → 사람이 읽기 쉬운 값
function formatCreatedAt(s?: string): string {
  if (!s) return "";
  // "YYYY.MM.DD" 포맷 지원
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(s)) return s;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return s;
  const d = new Date(t);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

// JWT에서 내 memberId 파싱
function getUserIdFromToken(token: string): number | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    // @ts-ignore
    const bin = typeof atob === "function" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
    const json = decodeURIComponent(Array.from(bin).map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
    const payload = JSON.parse(json);
    const raw = payload.memberId ?? payload.userId ?? payload.id ?? payload.sub;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch { return null; }
}

export default function UnifiedDetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string | string[] }>();
  const id = Number(Array.isArray(productId) ? productId[0] : productId);

  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id || Number.isNaN(id)) {
        showAlert("오류", "잘못된 상품 ID 입니다.");
        router.replace("/(home)");
        return;
      }
      const t = await tokenStore.get();
      if (!t) {
        showAlert("로그인이 필요합니다.");
        router.replace("/(login)");
        return;
      }
      setToken(t);
      setReady(true);
    })();
  }, [id, router]);

  if (!ready || !token) {
    return (
      <View style={styles.webRoot}>
        <SafeAreaView style={styles.phoneFrame}>
          <View style={styles.center}><ActivityIndicator size="large" /></View>
        </SafeAreaView>
      </View>
    );
  }

  return <DetailContent id={id} token={token} />;
}

function DetailContent({ id, token }: { id: number; token: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<"notifications" | "chat" | "home" | "community" | "profile">("home");
  const onTabPress = (tab: string) => setActiveTab(tab as any); 
  const myId = getUserIdFromToken(token);

  const { data, isLoading, error, refetch } = useProductDetail(id, token); // token optional이면 그대로 동작
  const toggleLike = useToggleLike(id, token);
  const { mutate: deleteProduct } = useDeleteProduct();

  // 화면 재진입 시 최신화
  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error || !data) {
    showAlert("오류", (error as any)?.message ?? "상품 정보를 불러오지 못했습니다.");
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          {(error as any)?.message ?? "상품 정보를 불러오지 못했습니다."}
        </Text>
      </View>
    );
  }

  // ---- 데이터 매핑 ----
  const images = (Array.isArray(data.images) ? data.images : [])
    .map((img: any) => ({ imageUrl: img?.imageUrl ?? "" }))
    .filter((i: any) => i.imageUrl);

  const priceNum =
    typeof data.price === "number"
      ? data.price
      : Number(String(data.price ?? "0").replace(/[^\d]/g, ""));

  // 상태 매핑 (기존 detail.tsx의 버그 수정)
  const uiStatus = mapStatusKToUI(data.status as string);

  // 프로필 이미지(서버가 기본 이미지 URL을 보냄)
  const avatar: ImageSourcePropType = data.sellerImageUrl ? ({ uri: data.sellerImageUrl } as ImageURISource) : DEFAULT_AVATAR;

  const product = {
    id: String(id),
    title: data.title,
    price: priceNum,
    category: data.category,
    description: data.content,
    images,
    user: {
      nickname: data.sellerNickname ?? `판매자 #${data.sellerId}`,
      postedAt: formatCreatedAt(data.createdAt),
      avatar,
    },
    status: uiStatus,
    liked: Boolean(data.liked),
    likeCount: Number(data.likeCount ?? 0),
  };

  const isOwner = data.seller === true || (myId != null && Number(data.sellerId) === myId);

  // ---- 핸들러 ----
  const handleEdit = () => {
    router.push({ pathname: "/(addProduct)/edit/[productId]", params: { productId: String(id) } });
  };

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: (res: any) => {
        showAlert("완료", res?.message ?? "상품이 삭제되었습니다.");
        router.replace("/(home)");
      },
      onError: (e: any) => {
        const msg = e?.response?.data?.message || e?.message || "상품 삭제 중 오류가 발생했습니다.";
        showAlert("오류", msg);
      },
    });
  };

  const handleChat = () => {
    console.log("채팅하기 클릭");
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: TABBAR_SPACE }]}  
          showsVerticalScrollIndicator={false}
        >
          <ProductCard
            product={product}
            // 소유자는 좋아요 토글 불필요 → undefined 전달
            onToggleLike={
              isOwner
                ? undefined
                : async () => { await toggleLike.mutateAsync(); }
            }
          />

          {isOwner ? (
            <ProductOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <BottomButtonGroup status={product.status} onChat={handleChat} />
          )}
        </ScrollView>
        <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
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
  scrollContainer: { paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
