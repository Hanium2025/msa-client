import React from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useProductDetail } from "../hooks/useProductDetail";
import ProductCard from "../components/organisms/ProductCard";
import BottomButtonGroup from "../components/molecules/BottomButtonGroup";
import { useLocalSearchParams } from "expo-router";

export default function DetailScreen() {
  console.log("DetailScreen mounted!");
  const { productId } = useLocalSearchParams();
  console.log("productId from URL:", productId);

  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoxLCJleHAiOjE3NTQ4MzE4MzcsImVtYWlsIjoiaGVsbG9AZW1haWwuY29tIn0.6LWSjwgdyu7aqF8kEBcMjW88k_kYyth3zrSpt2K-I3kOX6iXbP9QO-_Lrcc5fHsehaPuDEL4-3JFSKYVzYRw1w";

  const { data, isLoading, error } = useProductDetail(Number(productId), token);

  const handleChat = () => {
    console.log("채팅하기 클릭");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (error || !data) {
    const message = error?.message;
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "red" }}>{message}</Text>
      </View>
    );
  }

  // 형식 변환
  type ProductImage = { imageUrl: string };
  type ApiImage = {
    productImageId: number;
    imageUrl: string;
  };
  const images: ProductImage[] = Array.isArray(data?.images)
    ? data.images
        .map((img: Partial<ApiImage>) => ({ imageUrl: img?.imageUrl ?? "" }))
        .filter((i: ProductImage) => i.imageUrl)
    : [];
  const priceNum =
    typeof data?.price === "number"
      ? data.price
      : Number(String(data?.price ?? "0").replace(/[^\d]/g, ""));

  const product = {
    title: data.title,
    price: priceNum,
    category: data.category,
    description: data.content,
    images: images,
    user: {
      nickname: "판매자",
      postedAt: "방금 전",
    },
    status: (data.status === "SELLING"
      ? "ON_SALE"
      : data.status === "IN_PROGRESS"
      ? "IN_PROGRESS"
      : "SOLD_OUT") as "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT",
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
