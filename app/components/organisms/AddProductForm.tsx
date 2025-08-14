import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  View,
  StyleSheet,
  Platform,
  ToastAndroid,
} from "react-native";
import Button from "../atoms/Button";
import { Input } from "../atoms/Input";
import RegisterLabel from "../atoms/Label";
import { CategoryDropdown } from "../molecules/CategoryDropdown";
import { ImageUploader } from "../molecules/ImageUploader";
import { PriceInput } from "../molecules/PriceInput";
import { useAddProduct } from "../../hooks/useAddProduct";
import axios from "axios";

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") {
    // 브라우저 기본 alert 사용
    window.alert(text);
  } else {
    Alert.alert(title, message);
  }
};

export const AddProductForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("선택");
  const [images, setImages] = useState<File[]>([]); // ImageUploader로부터 파일 배열 받기

  const { mutate } = useAddProduct();

  const handleRegister = async () => {
    console.log(`업로드할 이미지 개수: ${images.length}`);

    if (images.length == 0) {
      showAlert("대표 이미지 1장은 필수입니다.");
      console.log("대표 이미지 1장은 필수입니다");
      return;
    }

    const productData = {
      title,
      content,
      price: parseInt(price.replace(/[^0-9]/g, ""), 10),
      category,
    };

    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoxLCJleHAiOjE3NTUxNjE2NjQsImVtYWlsIjoiaGVsbG9AZW1haWwuY29tIn0.IV8dJm8J6bxqT8MkqrZyfJ9xR9NyZBcpt92ycJ4WOcgmPBbMmOihy9a44TP5S9dqEeV5NVdNCKl-SWhdQOz3tw";

    const formData = new FormData();

    // JSON 파트
    formData.append("json", JSON.stringify(productData));

    // 이미지 파트
    if (images.length > 0) {
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
    }

    const router = useRouter();

    // 서버로 전송
    mutate(
      { formData, token },
      {
        onSuccess: (res) => {
          const message = res.message;
          const productId = res.data.productId;

          if (!productId) {
            showAlert("등록에 성공했으나 id를 가져오는 데에 실패했습니다.");
            console.log("등록에 성공했으나 id를 가져오는 데에 실패했습니다");
            return;
          }

          const goDetail = () =>
            router.replace({
              pathname: "/(addProduct)/detail",
              params: { productId: String(productId) },
            });

          if (Platform.OS === "web") {
            // 웹
            if (typeof window !== "undefined") window.alert(message);
            goDetail();
          } else if (Platform.OS === "android") {
            // 안드로이드
            ToastAndroid.show(message, ToastAndroid.SHORT);
            goDetail();
          } else {
            // iOS 등
            Alert.alert("등록 성공", message, [
              { text: "확인", onPress: goDetail },
            ]);
          }
        },
        onError: (err: unknown) => {
          let msg = "상품 등록 실패";
          if (axios.isAxiosError(err)) {
            msg = err.message;
            console.error("등록 에러:", msg);
          } else if (err instanceof Error) {
            msg = err.message;
            console.error("등록 에러:", err.message);
          } else {
            console.error("등록 에러:", err);
          }
          Alert.alert("오류", msg);
        },
      }
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formWrapper}>
        <ImageUploader images={images} setImages={setImages} />

        <View style={{ marginTop: 24 }}>
          <RegisterLabel required text="상품명" />
          <Input
            placeholder="상품명을 입력하세요"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <RegisterLabel required text="가격" />
          <PriceInput price={price} onChangePrice={setPrice} />
        </View>

        <View style={{ marginTop: 24 }}>
          <RegisterLabel required text="카테고리" />
          <CategoryDropdown selected={category} onSelect={setCategory} />
        </View>

        <View style={{ marginTop: 24 }}>
          <RegisterLabel text="상세설명" />
          <Input
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Button
            text="등록하기"
            variant="signUpComplete"
            onPress={handleRegister}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 393,
  },
});