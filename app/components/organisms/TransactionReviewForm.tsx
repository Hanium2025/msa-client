import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReportInfoRow } from "../atoms/ReportInfoRow"; // 입력용 TextInput 아톰
import { TransactionReviewDetailInput } from "../molecules/TransactionReviewDetailInput";

type Props = {
  // ★별점: 부모가 제어하려면 전달(선택), 안 주면 내부 상태로 동작
  rating?: number; // 0~5 (초기값/외부제어용)
  onChangeRating?: (n: number) => void; // 별 개수 변경 콜백(선택)

  // 상세 평가: 부모 제어 or 내부 상태
  detail?: string;
  onChangeDetail?: (v: string) => void;

  // 거래 상품 / 상대방: 부모 제어 or 내부 상태
  productName?: string;
  onChangeProductName?: (v: string) => void;
  seller?: string;
  onChangeSeller?: (v: string) => void;
};

export const TransactionReviewForm: React.FC<Props> = ({
  rating,
  onChangeRating,
  detail,
  onChangeDetail,
  productName,
  onChangeProductName,
  seller,
  onChangeSeller,
}) => {
  // ====== 입력 로컬 상태 (부모가 안 주면 내부 상태로 동작) ======
  const [productNameLocal, setProductNameLocal] = useState(productName ?? "");
  const [sellerLocal, setSellerLocal] = useState(seller ?? "");
  const [detailLocal, setDetailLocal] = useState(detail ?? "");

  // ====== 별 개별 토글 상태(Set) ======
  // 초기화: rating prop 이 있으면 그만큼 미리 채워둠 (1..rating)
  const initialSet = useMemo(
    () =>
      new Set<number>(
        typeof rating === "number"
          ? Array.from(
              { length: Math.max(0, Math.min(5, rating)) },
              (_, k) => k + 1
            )
          : []
      ),
    [] // 최초 마운트 시에만 사용
  );
  const [starSet, setStarSet] = useState<Set<number>>(initialSet);

  // rating prop이 외부에서 바뀌면 starSet 동기화
  useEffect(() => {
    if (typeof rating === "number") {
      setStarSet(
        new Set<number>(
          Array.from(
            { length: Math.max(0, Math.min(5, rating)) },
            (_, k) => k + 1
          )
        )
      );
    }
  }, [rating]);

  // 현재 별점 = 채워진 별 개수
  const ratingValue = starSet.size;

  // ====== 핸들러 ======
  const handleChangeProduct = (t: string) =>
    onChangeProductName ? onChangeProductName(t) : setProductNameLocal(t);

  const handleChangeSeller = (t: string) =>
    onChangeSeller ? onChangeSeller(t) : setSellerLocal(t);

  const handleChangeDetail = (t: string) =>
    onChangeDetail ? onChangeDetail(t) : setDetailLocal(t);

  // ★ 개별 별 토글
  const toggleStar = (i: number) => {
    setStarSet((prev) => {
      // 1..i 가 모두 채워져 있는지 검사
      const allUpToI = Array.from({ length: i }, (_, k) => k + 1).every((n) =>
        prev.has(n)
      );

      // 이미 1..i가 채워져 있으면 → i만 해제 → 1..(i-1)
      // 아니면 → 1..i 모두 채우기
      const targetCount = allUpToI ? i - 1 : i;

      const next = new Set<number>();
      for (let n = 1; n <= targetCount; n++) next.add(n);

      onChangeRating?.(next.size);
      return next;
    });
  };

  // 표시값 결정 (부모 제어값 우선)
  const productValue = productName ?? productNameLocal;
  const sellerValue = seller ?? sellerLocal;
  const detailValue = detail ?? detailLocal;

  return (
    <View style={s.container}>
      {/* 거래 상품 / 상대방 */}
      <ReportInfoRow
        label="거래 상품"
        value={productValue}
        onChangeText={handleChangeProduct}
        placeholder="상품명 가나다"
        textColor="#084C63"
      />
      <ReportInfoRow
        label="상대방"
        value={sellerValue}
        onChangeText={handleChangeSeller}
        placeholder="홍길동"
        textColor="#084C63"
      />

      {/* 별점 (개별 토글) */}
      <View style={s.row}>
        <Text style={s.label}>별점</Text>
        <View style={s.stars}>
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = starSet.has(i);
            return (
              <Pressable key={i} onPress={() => toggleStar(i)} hitSlop={6}>
                <Ionicons
                  name={filled ? "star" : "star-outline"}
                  size={22}
                  color="#084C63"
                  style={{ marginHorizontal: 3 }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={s.divider} />

      {/* 상세 평가 */}
      <TransactionReviewDetailInput
        value={detailValue}
        onChange={handleChangeDetail}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#FFFFFF" },

  row: {
    minHeight: 44,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 14, color: "#000", fontWeight: "400" },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
  },
});
