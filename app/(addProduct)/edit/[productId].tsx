import React, { useEffect, useMemo, useState } from "react";
import {
  Alert, Platform, SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RegisterLabel from "../../components/atoms/Label";
import { Input } from "../../components/atoms/Input";
import { PriceInput } from "../../components/molecules/PriceInput";
import { CategoryDropdown } from "../../components/molecules/CategoryDropdown";
import { ImageUploader } from "../../components/molecules/ImageUploader";
import Button from "../../components/atoms/Button";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { tokenStore } from "../../auth/tokenStore";

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
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return <EditContent productId={id} />;
}

function EditContent({ productId }: { productId: number }) {
  const router = useRouter();
  const { data, isLoading, error } = useProductDetail(productId);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("선택");

  // 새로 추가할 이미지
  const [newImages, setNewImages] = useState<File[]>([]);
  // 기존 이미지 + 유지/삭제 토글
  type ExistingImage = { productImageId: number; imageUrl: string; keep: boolean };
  const [existing, setExisting] = useState<ExistingImage[]>([]);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setContent(data.content ?? "");
    setCategory(data.category ?? "선택");
    const priceNum =
      typeof data.price === "number" ? data.price :
      Number(String(data.price ?? "0").replace(/[^\d]/g, ""));
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
  const MAX_IMAGES = 5;
  const remaining = Math.max(0, MAX_IMAGES - keptCount - newImages.length);

  const toggleKeep = (id: number) => {
    setExisting((prev) =>
      prev.map((e) => (e.productImageId === id ? { ...e, keep: !e.keep } : e))
    );
  };

  const removeNewImageAt = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ImageUploader가 maxCount를 지원하지 않는다고 가정하고 강제 제한
  const handleSetNewImages = (list: File[]) => {
    const allow = MAX_IMAGES - keptCount;
    if (list.length > allow) {
      showAlert("이미지 제한", `기존+신규 합쳐 최대 ${MAX_IMAGES}장입니다.\n남은 슬롯: ${allow}장`);
      setNewImages(list.slice(0, allow));
    } else {
      setNewImages(list);
    }
  };

  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const onSubmit = () => {
    if (!title.trim()) return showAlert("상품명은 필수입니다.");
    const priceValue = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    if (priceValue <= 0) return showAlert("가격을 올바르게 입력해 주세요.");
    if (category === "선택") return showAlert("카테고리를 선택해 주세요.");

    const leftImageIds = existing.filter((e) => e.keep).map((e) => e.productImageId);
    if (leftImageIds.length + newImages.length > MAX_IMAGES) {
      return showAlert("이미지 제한", `최대 ${MAX_IMAGES}장까지 가능합니다.`);
    }

    updateProduct(
      {
        productId,
        title: title.trim(),
        content: content.trim(),
        price: priceValue,
        category,
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
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* 이미지 라벨 */}
        <RegisterLabel required text="이미지 (최대 5장)" />

        {/* ✔ 기존(유지) + 신규 프리뷰 + 추가 슬롯을 한 줄 컨테이너에 묶기 */}
        <View style={styles.imageRow}>
          {/* 기존 이미지 (유지/삭제 토글) */}
          {existing.map((img) => (
            <View key={`old-${img.productImageId}`} style={styles.thumb}>
              <Image source={{ uri: img.imageUrl }} style={styles.thumbImg} />
              <TouchableOpacity onPress={() => toggleKeep(img.productImageId)} style={styles.badge}>
                <Text style={{ color: "#fff", fontSize: 12 }}>{img.keep ? "유지" : "삭제"}</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 신규 이미지 프리뷰 (삭제 버튼) */}
          {newImages.map((file, idx) => (
            <View key={`new-${idx}`} style={styles.thumb}>
              {/* 웹 File 미리보기 */}
              {Platform.OS === "web" ? (
                <Image src={URL.createObjectURL(file)} style={styles.thumbImg as any} />
              ) : (
                // 네이티브는 ImageUploader가 넣어주는 uri를 쓰는 게 안전
                // 여기선 단순 표시 생략 가능
                <View style={[styles.thumbImg, { alignItems: "center", justifyContent: "center" }]}>
                  <Text>새 이미지</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => removeNewImageAt(idx)} style={[styles.badge, { backgroundColor: "#b00020" }]}>
                <Text style={{ color: "#fff", fontSize: 12 }}>지우기</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 추가(+) 타일: 남은 슬롯이 있을 때만 노출 */}
          {remaining > 0 && (
            <View style={styles.addSlot}>
              {/* 기존 ImageUploader 재사용: 같은 row에 들어오도록 width 제한 */}
              <ImageUploader
                images={newImages}
                setImages={handleSetNewImages}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: 24 }}>
          <RegisterLabel required text="상품명" />
          <Input placeholder="상품명을 입력하세요" value={title} onChangeText={setTitle} />
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
          <Input value={content} onChangeText={setContent} multiline numberOfLines={5} />
        </View>

        <View style={{ marginVertical: 16 }}>
          <Button
            text={isPending ? "수정 중..." : "수정 완료"}
            variant="signUpComplete"
            onPress={onSubmit}
            disabled={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { paddingVertical: 16, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // 한 줄에 이미지들을 나열하고 줄바꿈 허용
  imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },

  // 썸네일/추가 타일 공통 사이즈
  thumb: { width: 96, height: 96, borderRadius: 8, overflow: "hidden", position: "relative", backgroundColor: "#eee" },
  thumbImg: { width: "100%", height: "100%" },
  badge: { position: "absolute", bottom: 6, right: 6, backgroundColor: "#111", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, opacity: 0.85 },

  // ImageUploader가 이 안에서 “+ 타일”을 표시하도록 작은 컨테이너 부여
  addSlot: { width: 96, height: 96, borderRadius: 8, overflow: "hidden" },
});

