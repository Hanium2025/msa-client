// AddProductForm.tsx
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, ScrollView, View, StyleSheet, Platform, ToastAndroid } from "react-native";
import Button from "../atoms/Button";
import { Input } from "../atoms/Input";
import RegisterLabel from "../atoms/Label";
import { CategoryDropdown } from "../molecules/CategoryDropdown";
import { ImageUploader } from "../molecules/ImageUploader";
import { PriceInput } from "../molecules/PriceInput";
import { useAddProduct } from "../../hooks/useAddProduct";
import axios from "axios";
import { tokenStore } from "../../auth/tokenStore";

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

// 재사용 가능한 한 줄 필드 래퍼
const FieldRow = ({
  label,
  required,
  children,
  style,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: any;
}) => (
  <View style={[styles.row, style]}>
    <RegisterLabel required={required} text={label} style={styles.rowLabel} />
    <View style={styles.rowControl}>{children}</View>
  </View>
);

export const AddProductForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("선택");
  const [images, setImages] = useState<File[]>([]);
  const { mutate } = useAddProduct();

  const handleRegister = async () => {
    if (images.length === 0) return showAlert("대표 이미지 1장은 필수입니다.");

    const token = await tokenStore.get();
    if (!token) {
      showAlert("로그인이 필요합니다.");
      router.replace("/(beforeLogin)/login");
      return;
    }

    const productData = {
      title,
      content,
      price: parseInt(price.replace(/[^0-9]/g, ""), 10),
      category,
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(productData));
    images.forEach((img: any, idx: number) => {
      if (Platform.OS === "web") {
        formData.append("images", img as File, (img as File).name);
      } else {
        formData.append("images", {
          uri: img.uri,
          name: img.name ?? `image_${idx}.jpg`,
          type: img.type ?? "image/jpeg",
        } as any);
      }
    });

    mutate(
      { formData, token },
      {
        onSuccess: (res) => {
          const message = res.message ?? "등록 성공";
          const productId = res?.data?.productId;
          if (!productId) return showAlert("등록 성공", "id를 가져오지 못했습니다.");

          const goOwner = () =>
            router.replace({
              pathname: "/(addProduct)/owner/[productId]",
              params: { productId: String(productId) },
            });

          if (Platform.OS === "web") {
            window.alert(message);
            goOwner();
          } else if (Platform.OS === "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            goOwner();
          } else {
            Alert.alert("등록 성공", message, [{ text: "확인", onPress: goOwner }]);
          }
        },
        onError: (err: unknown) => {
          let msg = "상품 등록 실패";
          if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
          else if (err instanceof Error) msg = err.message;
          Alert.alert("오류", msg);
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formWrapper}>
        <RegisterLabel required text="대표사진" />
        <ImageUploader images={images} setImages={setImages} />

        {/* 한 줄: 라벨 + 입력 */}
        <FieldRow label="상품명" required style={{ marginTop: 20 }}>
          <Input
            placeholder="Value"
            value={title}
            onChangeText={setTitle}
            style={styles.input}        // ← 오른쪽 컨트롤 폭/높이
          />
        </FieldRow>

        <FieldRow label="가격" required style={{ marginTop: 14 }}>
          <PriceInput
            price={price}
            onChangePrice={setPrice}
            style={styles.input}        // PriceInput 컨테이너에 style 전달
          />
        </FieldRow>

        <FieldRow label="카테고리" required style={{ marginTop: 14 }}>
          <CategoryDropdown
            selected={category}
            onSelect={setCategory}
            style={{ height: 44 }}
          />
        </FieldRow>

        {/* 상세설명은 세로 배치 유지 */}
        <View style={{ marginTop: 18 }}>
          <RegisterLabel text="상세설명" />
          <Input
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
            style={[styles.input, { height: 140 }]}
          />
        </View>

        <View style={{ marginVertical: 16 }}>
          <Button text="등록하기" variant="signUpComplete" onPress={handleRegister} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 16, paddingHorizontal: 16 },
  formWrapper: { width: "100%", maxWidth: 393 },

  // 한 줄 레이아웃
  row: { flexDirection: "row", alignItems: "center", columnGap: 12 },
  rowLabel: { width: 84 },          // 라벨 고정폭 (디자인에 맞게 조절)
  rowControl: { flex: 1 },

  // 오른쪽 컨트롤 공통 스타일
  input: { height: 44, width: "100%" },
});
