// home.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import RegisterItemButton from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';
import BottomTabBar from '../components/molecules/BottomTabBar';
import { tokenStore } from '../auth/tokenStore';
import { useHomeProducts } from "../hooks/useHomeProduct";
import { useFocusEffect } from "@react-navigation/native";
import { fetchProductDetail } from "../lib/api/product";
import { CATEGORIES } from "../constants/categories";
const TITLE_TO_SLUG = Object.fromEntries(CATEGORIES.map(c => [c.title, c.slug])) as Record<string, string>;

const PHONE_WIDTH = 390;
const TRANSPARENT_PX_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

function getUserIdFromToken(token: string): number | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");

    const hasAtob = typeof atob === "function";
    // @ts-ignore
    const hasBuffer = typeof Buffer !== "undefined";

    const binary = hasAtob
      ? atob(base64)
      : hasBuffer
        // @ts-ignore
        ? Buffer.from(base64, "base64").toString("binary")
        : null;

    if (!binary) return null;

    const json = decodeURIComponent(
      Array.from(binary)
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const payload = JSON.parse(json);

    const raw = payload.memberId ?? payload.userId ?? payload.id ?? payload.sub;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  // useHomeProducts 올바른 사용
  const { data, isLoading, error, refetch } = useHomeProducts();

  useFocusEffect(React.useCallback(() => {
    refetch();
  }, [refetch]));
  const products = data?.products ?? [];
  const recentCategories = data?.categories ?? [];

  // CategorySection이 기대하는 형태로 어댑트
  const recentCategoriesForSection = recentCategories.slice(0, 4).map((c, idx) => ({
    id: String(idx),
    name: c.name,
    slug: TITLE_TO_SLUG[c.name] ?? 'OTHER',
  }));

  //useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) router.push('/(login)');
    else router.push('/(addProduct)');
  }, [router]);

  const handlePressProduct = useCallback(
    async (id: string) => {
      const productId = Number(id);
      const token = await tokenStore.get();

      router.push({ pathname: "/(addProduct)/detail", params: { productId: String(productId) } });
    },
    [router]
  );

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 스크롤 영역 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <SearchBar />
          <RegisterItemButton
            variant="registerItem"
            text="내 물품 등록하기"
            onPress={handleRegisterPress}
          />

          {isLoading ? (
            <View style={{ paddingVertical: 24, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
              <Text>상품을 불러오지 못했습니다.</Text>
            </View>
          ) : (
            <>
              <NewProductsSection products={products} onPress={handlePressProduct} />
              <CategorySection
  categories={recentCategoriesForSection}
  loading={isLoading}
  onPressHeaderRight={() => router.push("/(category)")} // ← /(category)/index.tsx 로 이동
  onPressCategory={(slug) =>
    router.push({ pathname: "/(category)/[slug]", params: { slug } })
  }
/>
            </>
          )}
        </ScrollView>

        {/* 고정 하단 탭바 (스크롤 밖) */}
        <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F5F6F7' : '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: '#fff',
    maxWidth: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    width: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    alignSelf: 'center',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
  },
});
