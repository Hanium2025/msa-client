// app/(addProduct)/detail.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  Image,
  Modal,
  Pressable,
  ImageSourcePropType,
  ImageURISource,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ProductCard from "../components/organisms/ProductCard";
import BottomButtonGroup from "../components/molecules/BottomButtonGroup"; // 비작성자
import ProductOwnerActions from "../components/organisms/ProductOwnerActions"; // 작성자
import BottomTabBar from "../components/molecules/BottomTabBar";

import { tokenStore } from "../auth/tokenStore";
import { useProductDetail } from "../hooks/useProductDetail";
import { useToggleLike } from "../hooks/useToggleLike";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

const PHONE_WIDTH = 390;
const TABBAR_SPACE = 90;
const BACK_ICON = require("../../assets/images/back.png");

const DEFAULT_AVATAR =
  require("../../assets/images/default_profile.png") as ImageSourcePropType;

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

function mapStatusKToUI(k?: string): "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT" {
  switch (k) {
    case "판매 중":
      return "ON_SALE";
    case "예약 중":
      return "IN_PROGRESS";
    case "판매 완료":
      return "SOLD_OUT";
    default:
      return "ON_SALE";
  }
}

// "2025.08.26" 또는 ISO 문자열 → 사람이 읽기 쉬운 값
function formatCreatedAt(s?: string): string {
  if (!s) return "";
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(s)) return s; // "YYYY.MM.DD" 지원
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
    const bin =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("binary");
    const json = decodeURIComponent(
      Array.from(bin)
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const payload = JSON.parse(json);
    const raw = payload.memberId ?? payload.userId ?? payload.id ?? payload.sub;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export default function UnifiedDetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{
    productId?: string | string[];
  }>();
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
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return <DetailContent id={id} token={token} />;
}

function DetailContent({ id, token }: { id: number; token: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "notifications" | "chat" | "home" | "community" | "profile"
  >("home");
  const onTabPress = (tab: string) => setActiveTab(tab as any);
  const myId = getUserIdFromToken(token);
  const [reportOpen, setReportOpen] = useState(false);
  const REPORT_ICON = require("../../assets/images/report.png");

  const { data, isLoading, error, refetch } = useProductDetail(id, token);
  const toggleLike = useToggleLike(id, token);
  const { mutate: deleteProduct } = useDeleteProduct();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
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

  const uiStatus = mapStatusKToUI(data.status as string);

  const avatar: ImageSourcePropType = data.sellerImageUrl
    ? ({ uri: data.sellerImageUrl } as ImageURISource)
    : DEFAULT_AVATAR;

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

  const isOwner =
    data.seller === true || (myId != null && Number(data.sellerId) === myId);
  const sellerId: number | undefined =
    (data as any).sellerId ?? (data as any).seller?.id;

  // ---- 핸들러 ----
  const handleEdit = () => {
    router.push({
      pathname: "/(addProduct)/edit/[productId]",
      params: { productId: String(id) },
    });
  };

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: (res: any) => {
        showAlert("완료", res?.message ?? "상품이 삭제되었습니다.");
        router.replace("/(home)");
      },
      onError: (e: any) => {
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "상품 삭제 중 오류가 발생했습니다.";
        showAlert("오류", msg);
      },
    });
  };

  // const handleChat = () => {
  //   if (!sellerId) {
  //     showAlert("오류", "판매자 정보가 없어 채팅을 시작할 수 없습니다.");
  //     return;
  //   }
  //   // router.push({
  //   //   pathname: "/(chatroomList)",
  //   //   params: {
  //   //     productId: String(id),
  //   //     receiverId: String(sellerId),
  //   //   },
  //   // });
  // };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[
              styles.backBtn,
              Platform.OS === "web" && ({ cursor: "pointer" } as any),
            ]}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Image
              source={BACK_ICON}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: TABBAR_SPACE },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ position: "relative" }}>
            <ProductCard
              product={product}
              onToggleLike={
                isOwner
                  ? undefined
                  : async () => {
                      await toggleLike.mutateAsync();
                    }
              }
            />

            {!isOwner && (
              <Pressable
                onPress={() => setReportOpen(true)}
                style={styles.reportFab}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="상품 신고하기"
              >
                <Image
                  source={REPORT_ICON}
                  style={styles.reportIcon}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </View>

          {isOwner ? (
            <ProductOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <BottomButtonGroup
              status={product.status}
              productId={data.productId}
              receiverId={data.sellerId}
              token={token}
            />
          )}
        </ScrollView>

        {/* 신고 모달 */}
        <Modal
          transparent
          visible={reportOpen}
          animationType="fade"
          onRequestClose={() => setReportOpen(false)}
        >
          <View style={styles.alertBackdrop}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>해당 상품에 문제가 있나요?</Text>
              <Text style={styles.alertMessage}>
                ‘신고’ 버튼을 누르면 상품 신고 화면으로 이동합니다.
              </Text>

              <View style={styles.alertActions}>
                <Pressable
                  style={styles.alertBtn}
                  onPress={() => setReportOpen(false)}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.alertBtnInner,
                        pressed && styles.alertBtnPressed,
                      ]}
                    >
                      <Text style={[styles.alertBtnText, styles.alertCancel]}>
                        취소
                      </Text>
                    </View>
                  )}
                </Pressable>

                <View style={styles.alertDividerVertical} />

                <Pressable
                  style={styles.alertBtn}
                  onPress={() => {
                    setReportOpen(false);

                    router.push({
                      pathname: "/(report)",
                      params: { productId: String(id) },
                    });
                  }}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.alertBtnInner,
                        pressed && styles.alertBtnPressed,
                      ]}
                    >
                      <Text
                        style={[styles.alertBtnText, styles.alertDestructive]}
                      >
                        신고
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

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

  reportFab: {
    position: "absolute",
    right: 50,
    bottom: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  reportIcon: { width: 20, height: 20 },

  alertBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  alertBox: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  alertTitle: {
    paddingTop: 16,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },
  alertMessage: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    color: "#6B7280",
  },
  alertActions: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    height: 46,
  },
  alertBtn: { flex: 1 },
  alertBtnInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBtnPressed: {
    backgroundColor: "#F3F4F6",
  },
  alertDividerVertical: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  alertBtnText: {
    fontSize: 17,
    fontWeight: "600",
  },
  alertCancel: { color: "#0A84FF" },
  alertDestructive: { color: "#FF3B30" },

  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  backBtn: { paddingVertical: 6, paddingRight: 6 },
  backIcon: { width: 16, height: 16 },
});
