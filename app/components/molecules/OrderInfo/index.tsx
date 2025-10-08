// components/molecules/OrderInfo.tsx
import React, { useEffect, useMemo } from "react";
import { Text, View, Image, ImageSourcePropType } from "react-native";
import styles from "./OrderInfo.style";

type NumLike = number | string | undefined;

interface Props {
  title: string;
  price: NumLike;                 // 숫자/문자 모두 허용
  shippingFee?: NumLike;          // 기본 0
  image?: ImageSourcePropType;    // { uri: ... } 또는 require(...)
  sellerNickname?: string;
  onAmountChange?: (amount: number) => void; // 총액 상위로 전달(결제 amount)
}

const toNumber = (v: NumLike) =>
  typeof v === "number"
    ? v
    : Number(String(v ?? "").replace(/[^\d.-]/g, "")) || 0;

const fmtKRW = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function OrderInfo({
  title,
  price,
  shippingFee = 0,
  image,
  sellerNickname,
  onAmountChange,
}: Props) {
  const priceN = useMemo(() => toNumber(price), [price]);
  const shipN = useMemo(() => toNumber(shippingFee), [shippingFee]);
  const total = useMemo(() => priceN + shipN, [priceN, shipN]);

  useEffect(() => {
    onAmountChange?.(total);
  }, [total, onAmountChange]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>주문내역</Text>

        <View style={styles.productContainer}>
          {image ? (
            <Image source={image} style={styles.imageGrid} />
          ) : (
            <View style={styles.imageGrid} />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{title}</Text>
            {!!sellerNickname && (
              <Text style={styles.sellerName}>판매자: {sellerNickname}</Text>
            )}
          </View>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsLabel}>상품 가격:</Text>
            <Text style={styles.priceDetailsValue}>{fmtKRW(priceN)}</Text>
          </View>
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsLabel}>배송비:</Text>
            <Text style={styles.priceDetailsValue}>{fmtKRW(shipN)}</Text>
          </View>
        </View>

        <View style={styles.priceDetails}>
          <Text style={styles.totalPriceLabel}>총 결제 금액:</Text>
          <Text style={styles.totalPriceValue}>{fmtKRW(total)}</Text>
        </View>
      </View>
    </View>
  );
}
