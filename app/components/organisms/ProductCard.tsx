import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import UserInfo from "../molecules/UserInfo";
import ImageCarousel from "../molecules/ImageCarousel";
import PriceText from "../atoms/PriceText";
import Tag from "../atoms/Tag";

// 백엔드 응답 형태에 맞게 타입 정의
interface Product {
  title: string;
  price: number;
  category: string;
  description: string;
  user?: {
    nickname: string;
    postedAt: string;
  };
  status: "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT";
  likeCount?: number;
  liked?: boolean; // 사용자가 좋아요 눌렀는지 여부
  images: { imageUrl: string }[];
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <View style={styles.card}>
      {/* 제목 + 가격 */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{product.title}</Text>
        <PriceText price={product.price} />
      </View>

      {/* 작성자 + 카테고리 */}
      <View style={styles.userRow}>
        <UserInfo
          nickname={product.user?.nickname ?? "알 수 없음"}
          postedAt={product.user?.postedAt ?? "방금 전"}
        />
        <Tag label={product.category} />
      </View>

      {/* 이미지 + 설명 묶음 */}
      <View style={styles.body}>
        <ImageCarousel images={product.images.map((img) => img.imageUrl)} />
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* 좋아요 수 */}
      <View style={styles.likesRow}>
        <Image
          source={
            product.liked
              ? require("../../../assets/images/star_black.png")
              : require("../../../assets/images/star_gray.png")
          }
          style={styles.starIcon}
        />
        <Text style={styles.likesText}>{product.likeCount ?? 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 341,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#D9D9D9",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  body: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    width: 303,
    height: 242,
    color: "#333",
    marginTop: 12,
    lineHeight: 20,
  },
  likesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  starIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  likesText: {
    fontSize: 13,
    color: "#555",
  },
});
