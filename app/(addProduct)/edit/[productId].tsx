import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "../../components/atoms/Button";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { tokenStore } from "../../auth/tokenStore";

import { ImageSection } from "../../components/organisms/ImageSection";
import { ProductForm } from "../../components/organisms/ProductForm";

const PHONE_WIDTH = 390;
const MAX_IMAGES = 5;

type CategoryValue =
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'CLOTHES'
  | 'BOOK'
  | 'BEAUTY'
  | 'FOOD'
  | 'ETC';

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

type ExistingImage = { productImageId: number; imageUrl: string; keep: boolean };

export default function EditProductScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const id = Number(productId);

  const [boot, setBoot] = useState(false);
  const [authed, setAuthed] = useState(false);

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
      setAuthed(true);
      setBoot(true);
    })();
  }, [id, router]);

  if (!boot || !authed) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <EditContent productId={id} />
      </SafeAreaView>
    </View>
  );
}

function EditContent({ productId }: { productId: number }) {
  const router = useRouter();
  const { data, isLoading, error } = useProductDetail(productId);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CategoryValue | '선택'>('선택');

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>([]);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setContent(data.content ?? "");
    const cat = (data.category ?? '') as string;
  const ok: CategoryValue[] = ['ELECTRONICS','FURNITURE','CLOTHES','BOOK','BEAUTY','FOOD','ETC'];
  setCategory(ok.includes(cat as CategoryValue) ? (cat as CategoryValue) : '선택');

    const priceNum =
      typeof data.price === "number"
        ? data.price
        : Number(String(data.price ?? "0").replace(/[^\d]/g, ""));
    setPrice(String(priceNum));

    const ex: ExistingImage[] = Array.isArray(data.images)
      ? data.images
          .map((img: any) => ({
            productImageId: Number(img?.productImageId),
            imageUrl: String(img?.imageUrl ?? ""),
            keep: true,
          }))
          .filter((x) => x.productImageId && x.imageUrl)
      : [];
    setExisting(ex);
  }, [data]);

  const keptCount = existing.filter((e) => e.keep).length;
  const remaining = Math.max(0, MAX_IMAGES - keptCount - newImages.length);

  const onSubmit = () => {
    if (!title.trim()) return showAlert("상품명은 필수입니다.");
    const priceValue = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (priceValue <= 0) return showAlert("가격을 올바르게 입력해 주세요.");
    if (category === "선택") return showAlert("카테고리를 선택해 주세요.");

    const leftImageIds = existing.filter(e => e.keep).map(e => e.productImageId);

    updateProduct(
      {
        productId,
        title: title.trim(),
        content: content.trim(),
        price: priceValue,
        category: category as CategoryValue,
        leftImageIds,
        newImages,
      },
      {
        onSuccess: (res: any) => {
          showAlert("완료", res?.message ?? "상품 수정이 완료되었습니다.");
          router.replace(`/(addProduct)/owner/${productId}`);
        },
        onError: (e: any) => {
          const msg = e?.response?.data?.message || e?.message || "상품 수정 중 오류가 발생했습니다.";
          showAlert("오류", msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          {(error as any)?.message ?? "상품 정보를 불러오지 못했습니다."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={styles.container}>
      {/* 이미지 섹션 */}
      <ImageSection
        existing={existing.map(e => ({ id: e.productImageId, uri: e.imageUrl, keep: e.keep }))}
        newImages={newImages}
        onRemoveExisting={id => setExisting(prev => prev.map(e => e.productImageId === id ? { ...e, keep: false } : e))}
        onRemoveNew={idx => setNewImages(prev => prev.filter((_, i) => i !== idx))}
        onAddNew={(list) => setNewImages(list)}
        remaining={remaining}
      />

      {/* 상품 입력 폼 */}
      <ProductForm
        title={title}
        setTitle={setTitle}
        price={price}
        setPrice={setPrice}
        category={category}
        setCategory={setCategory}
        content={content}
        setContent={setContent}
      />

      <View style={{ marginVertical: 16 }}>
        <Button
          text={isPending ? "수정 중..." : "수정 완료"}
          variant="signUpComplete"
          onPress={onSubmit}
          disabled={isPending}
        />
      </View>
    </ScrollView>
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
  container: { paddingVertical: 16, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
