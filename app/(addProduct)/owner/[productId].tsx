// app/(addProduct)/owner/[productId].tsx
import React, { useEffect, useState } from "react";
import {
  View, SafeAreaView, ScrollView, StyleSheet,
  ActivityIndicator, Text, Alert, Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ProductCard from "../../components/organisms/ProductCard";
import ProductOwnerActions from "../../components/organisms/ProductOwnerActions";
import { tokenStore } from "../../auth/tokenStore";
import { useProductDetail } from "../../hooks/useProductDetail";

const PHONE_WIDTH = 390; // iPhone 기준 폭

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
  const { data, isLoading, error } = useProductDetail(id, token);
  const router = useRouter();

  const handleEdit = () => {
    router.push({
      pathname: "/(addProduct)/edit/[productId]",
      params: { productId: String(id) },
    });
  };
  const handleDelete = () => {
    console.log("삭제하기 클릭", id);
  };

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

  const images = (Array.isArray(data.images) ? data.images : [])
    .map((img: any) => ({ imageUrl: img?.imageUrl ?? "" }))
    .filter((i: any) => i.imageUrl);

  const priceNum =
    typeof data.price === "number" ? data.price
    : Number(String(data.price ?? "0").replace(/[^\d]/g, ""));

  const status =
    data.status === "SELLING" ? "ON_SALE" :
    data.status === "IN_PROGRESS" ? "IN_PROGRESS" : "SOLD_OUT";

  const product = {
    id: String(id),
    title: data.title,
    price: priceNum,
    category: data.category,
    description: data.content,
    images,
    user: { nickname: "판매자", postedAt: "방금 전" },
    status: status as "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT",
    likeCount: Number(data.likeCount ?? 0),
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ProductCard product={product} />
          <ProductOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
        </ScrollView>
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
