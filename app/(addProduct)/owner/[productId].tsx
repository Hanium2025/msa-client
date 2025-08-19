import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View, SafeAreaView, ScrollView, StyleSheet,
  ActivityIndicator, Text, Alert, Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProductCard from "../../components/organisms/ProductCard";
import ProductOwnerActions from "../../components/organisms/ProductOwnerActions";
import BottomTabBar from "../../components/molecules/BottomTabBar";
import { tokenStore } from "../../auth/tokenStore";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";

const PHONE_WIDTH = 390;
const TABBAR_SPACE = 90; // 스크롤 내용이 탭바에 가리지 않도록 여백

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function DetailOwnerScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const id = Number(productId);

  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return <OwnerContent id={id} token={token} />;
}

function OwnerContent({ id, token }: { id: number; token: string }) {
  const router = useRouter();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { data, isLoading, error, refetch } = useProductDetail(id, token);

  const [activeTab, setActiveTab] = useState<'notifications' | 'chat' | 'documents' | 'explore' | 'profile'>('documents');
  const onTabPress = (tab: string) => {
    setActiveTab(tab as any);
  };

  // 화면이 다시 포커스될 때마다 최신 데이터로 갱신
  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => { };
    }, [id, refetch])
  );

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

  const d = data!;
  const images = (Array.isArray(d.images) ? d.images : [])
    .map((img: any) => ({ imageUrl: img?.imageUrl ?? "" }))
    .filter((i: any) => i.imageUrl);

  const priceNum =
    typeof d.price === "number" ? d.price : Number(String(d.price ?? "0").replace(/[^\d]/g, ""));

  const status =
    d.status === "SELLING" ? "ON_SALE" :
      d.status === "IN_PROGRESS" ? "IN_PROGRESS" : "SOLD_OUT";

  const product = {
    id: String(id),
    title: d.title,
    price: priceNum,
    category: d.category,
    description: d.content,
    images,
    user: { nickname: "판매자", postedAt: "방금 전" },
    status: status as "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT",
    likeCount: Number(d.likeCount ?? 0),
  };

  const handleEdit = () => {
    router.push({ pathname: "/(addProduct)/edit/[productId]", params: { productId: String(id) } });
  };

  const handleDelete = () => {
    deleteProduct(id, {
      onSuccess: (res: any) => {
        const msg = res?.message ?? "상품이 삭제되었습니다.";
        showAlert("완료", msg);
        router.replace("/(home)");
      },
      onError: (e: any) => {
        const msg = e?.response?.data?.message || e?.message || "상품 삭제 중 오류가 발생했습니다.";
        showAlert("오류", msg);
      },
    });
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        {/* 스크롤 영역 */}
        <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: TABBAR_SPACE }]}>
          <ProductCard product={product} />
          <ProductOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
        </ScrollView>

        {/* 고정 하단 탭바 */}
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
