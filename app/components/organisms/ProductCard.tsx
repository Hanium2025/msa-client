import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import UserInfo from "../molecules/UserInfo";
import ImageCarousel from "../molecules/ImageCarousel";
import PriceText from "../atoms/PriceText";
import Tag from "../atoms/Tag";
import { Image, ImageProps } from "react-native";

interface Product {
  title: string;
  price: number;
  category: string;
  description: string;
  user: {
    nickname: string;
    postedAt: string;
    avatar?: ImageProps["source"];
  };
  status: "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT";
  likeCount?: number;
  liked?: boolean;
  images: { imageUrl: string }[];
}

interface Props {
  product: Product;
  // 서버에 좋아요 반영하고 최신 상태를 반환(또는 성공 여부)하는 옵셔널 콜백
  onToggleLike?: (nextLiked: boolean) => Promise<{ likeCount?: number } | void> | void;
}

const DEFAULT_AVATAR = require("../../../assets/images/default_profile.png");

export default function ProductCard({ product, onToggleLike }: Props) {
  const [liked, setLiked] = useState<boolean>(!!product.liked);
  const [likeCount, setLikeCount] = useState<number>(product.likeCount ?? 0);
  const [pending, setPending] = useState(false);
  const avatarSource = product.user.avatar ?? DEFAULT_AVATAR;
  const isInteractive = !!onToggleLike;
  
  const handleToggleLike = useCallback(async () => {
    if (pending || !isInteractive) return;        
    setPending(true);

    const prevLiked = liked;
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));

    try {
      if (onToggleLike) {
        const res = await onToggleLike(nextLiked);
        if (res && typeof res.likeCount === "number") {
          setLikeCount(res.likeCount);
        }
      }
    } catch (e) {
      // 실패 시 롤백
      setLiked(prevLiked);
      setLikeCount((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
    } finally {
      setPending(false);
    }
  }, [liked, onToggleLike, pending, isInteractive]);

  const starSource =
   !isInteractive
     ? require("../../../assets/images/star_black.png")  // 작성자 화면: 항상 검은 별
     : liked
       ? require("../../../assets/images/star_black.png")
       : require("../../../assets/images/star_gray.png");

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
          avatar={avatarSource}
          nickname={product.user?.nickname}
          postedAt={product.user?.postedAt}
        />
        <Tag label={product.category} />
      </View>

      {/* 이미지 + 설명 묶음 */}
      <View style={styles.body}>
        <ImageCarousel images={product.images.map((img) => img.imageUrl)} />
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* 좋아요(터치 가능) */}
      <Pressable
        onPress={handleToggleLike}
        disabled={pending || !isInteractive} 
        style={({ pressed }) => [
          styles.likesRow,
          (pressed && isInteractive) ? { opacity: 0.7 } : null,
        ]}
        hitSlop={10}
        accessibilityRole={isInteractive ? "button" : "text"}
        accessibilityLabel={isInteractive ? (liked ? "좋아요 취소" : "좋아요") : "좋아요 개수"}
      >
        <Image source={starSource} style={styles.starIcon} />
        <Text style={styles.likesText}>{likeCount}</Text>
      </Pressable>
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
    alignSelf: "flex-start", // 누르기 쉬운 위치 고정
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
