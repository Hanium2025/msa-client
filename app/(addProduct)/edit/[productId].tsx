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
  TouchableOpacity,
  Image,
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
const PHONE_WIDTH = 390; // iPhone 14 Pro width
const MAX_IMAGES = 5;

type CategoryValue =
  | 'ELECTRONICS'
  | 'FURNITURE'
  | 'CLOTHES'
  | 'BOOK'
  | 'BEAUTY'
  | 'FOOD'
  | 'ETC';

const isCategoryValue = (v: string): v is CategoryValue =>
  (['ELECTRONICS', 'FURNITURE', 'CLOTHES', 'BOOK', 'BEAUTY', 'FOOD', 'ETC'] as const).includes(v as any);

const CATEGORY_LABEL_TO_VALUE: Record<string, CategoryValue> = {
  'IT, 전자제품': 'ELECTRONICS',
  '가구, 인테리어': 'FURNITURE',
  '옷, 잡화, 장신구': 'CLOTHES',
  '도서, 학습 용품': 'BOOK',
  '헤어, 뷰티, 화장품': 'BEAUTY',
};


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

  // 웹에서는 390px 고정 프레임 중앙 정렬, 네이티브는 전체 화면
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

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("선택");

  // 새로 추가할 이미지(웹: File[])
  const [newImages, setNewImages] = useState<File[]>([]);
  // 기존 이미지(keep=true만 화면에 보임)
  const [existing, setExisting] = useState<ExistingImage[]>([]);

  useEffect(() => {
    if (!data) return;
    setTitle(data.title ?? "");
    setContent(data.content ?? "");
    setCategory(data.category ?? "선택");

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

  const removeExistingById = (id: number) => {
    // X 누르면 렌더에서 사라지도록 keep=false
    setExisting((prev) =>
      prev.map((e) => (e.productImageId === id ? { ...e, keep: false } : e))
    );
  };

  const removeNewImageAt = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ImageUploader가 maxCount 제어를 하지 않는다고 가정하고 강제 제한
  const handleSetNewImages = (list: File[]) => {
    const allow = MAX_IMAGES - keptCount; // 남은 슬롯(신규만 고려)
    if (list.length > allow) {
      showAlert(
        "이미지 제한",
        `기존+신규 합쳐 최대 ${MAX_IMAGES}장입니다.\n남은 슬롯: ${allow}장`
      );
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

    const leftImageIds = existing.filter(e => e.keep).map(e => e.productImageId);


    // 라벨이 들어오면 Enum 값으로 치환 (이미 값이면 그대로 사용)
    const categoryValue = CATEGORY_LABEL_TO_VALUE[category] ?? category;

    updateProduct(
      {
        productId,
        title: title.trim(),
        content: content.trim(),
        price: priceValue,
        category: categoryValue,   // 여기
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 이미지 라벨 */}
      <RegisterLabel required text="이미지 (최대 5장)" />

      {/* 썸네일 나열 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageRowH}
      >
        {/* 기존 이미지 */}
        {existing.filter(e => e.keep).map((img) => (
          <View key={`old-${img.productImageId}`} style={styles.thumb}>
            <Image source={{ uri: img.imageUrl }} style={styles.thumbImg} />
            <TouchableOpacity
              onPress={() => removeExistingById(img.productImageId)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeTxt}>×</Text>
            </TouchableOpacity>
            <View style={styles.badge}><Text style={styles.badgeTxt}>기존</Text></View>
          </View>
        ))}

        {/* 신규 이미지 */}
        {newImages.map((file, idx) => (
          <View key={`new-${idx}`} style={styles.thumb}>
            {Platform.OS === "web" ? (
              <Image
                source={{ uri: URL.createObjectURL(file) }}   // src → source={{uri}}
                style={styles.thumbImg}
              />
            ) : (
              <View style={[styles.thumbImg, { alignItems: "center", justifyContent: "center" }]}>
                <Text>새 이미지</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => removeNewImageAt(idx)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>×</Text>
            </TouchableOpacity>
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeTxt}>신규</Text>
            </View>
          </View>
        ))}

        {/* 추가 버튼 */}
        {remaining > 0 && (
          <View style={styles.thumb}>
            <ImageUploader
              images={newImages}
              setImages={handleSetNewImages}
              buttonOnly
              size={{ width: 192, height: 124 }}
            />
          </View>
        )}
      </ScrollView>


      <View style={styles.row}>
        <RegisterLabel required text="상품명" style={styles.label} />
        <Input
          placeholder="상품명을 입력하세요"
          value={title}
          onChangeText={setTitle}
          style={styles.flexInput}
        />
      </View>

      <View style={styles.row}>
        <RegisterLabel required text="가격" style={styles.label} />
        <PriceInput price={price} onChangePrice={setPrice} style={styles.flexInput} />
      </View>

      <View style={styles.row}>
        <RegisterLabel required text="카테고리" style={styles.label} />
        <CategoryDropdown
          selected={category}
          onSelect={setCategory}
          style={styles.flexInput}
        />
      </View>

      <View style={{ marginTop: 24 }}>
        <RegisterLabel text="상세설명" />
        <Input
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          style={[
      styles.textarea, // 새 스타일 적용
    ]}
        />
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
  );
}

const styles = StyleSheet.create({
  // 웹 중앙 정렬 프레임
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

  // 이미지 썸네일 레이아웃
  imageRowH: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  // 썸네일/추가 타일
  thumb: {
    width: 192,
    height: 124,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#eee",
  },
  thumbImg: { width: "100%", height: "100%" },

  // 우상단 X 버튼
  closeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeTxt: { color: "#fff", fontSize: 16, lineHeight: 16, fontWeight: "700" },

  // 좌하단 뱃지(옵션)
  badge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "#111",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    opacity: 0.85,
  },
  badgeNew: { backgroundColor: "#0d6efd" },
  badgeTxt: { color: "#fff", fontSize: 11 },

  addSlot: {
    width: 192,
    height: 124,
    borderRadius: 8,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderBottomWidth: 1,        // 추가
    borderBottomColor: "#E0E0E0", // 연한 회색
    paddingBottom: 8,
  },
  label: {
    width: 80, // 라벨 고정 폭
    marginRight: 8,
  },
  flexInput: {
    flex: 1,
  },

  textarea: {
    width: 345,
    height: 310,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top', // 안드로이드에서 위쪽 정렬
  },

});