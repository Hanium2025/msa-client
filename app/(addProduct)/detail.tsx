// app/(addProduct)/detail.tsx
import React from "react";
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

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") {
    window.alert(text);
  } else {
    Alert.alert(title, message);
  }
};

export default function DetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string | string[] }>();

  const parsedId = Array.isArray(productId)
    ? Number(productId[0])
    : Number(productId);

  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoxLCJleHAiOjE3NTUxNjQ3NTcsImVtYWlsIjoiaGVsbG9AZW1haWwuY29tIn0.3oAKQSc527uZfD8qJ1yotnlt2eU__Mzzd8d_ojNvtvTwiB1ZvDPs_ce_6WmqaQigo44lmJs1wzdHZQFKKCpc7w";

  const { data, isLoading, error } = useProductDetail(parsedId, token);

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
    showAlert("오류", error?.message ?? "상품 정보를 불러오지 못했습니다.");
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red", marginBottom: 8 }}>
          {error?.message ?? "상품 정보를 불러오지 못했습니다."}
        </Text>
      </View>
    );
  }

  type ProductImage = { imageUrl: string };
  const images: ProductImage[] = Array.isArray(data.images)
    ? data.images
        .map((img) => ({ imageUrl: img?.imageUrl ?? "" }))
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
