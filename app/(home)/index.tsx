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
import { CATEGORIES } from "../constants/categories";

const TITLE_TO_SLUG = Object.fromEntries(CATEGORIES.map(c => [c.title, c.slug])) as Record<string, string>;
const PHONE_WIDTH = 390;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  const { data, isLoading, error, refetch } = useHomeProducts();

  useFocusEffect(React.useCallback(() => { refetch(); }, [refetch]));

  const products = data?.products ?? [];
  const recentCategories = data?.categories ?? [];

  const recentCategoriesForSection = recentCategories.slice(0, 4).map((c, idx) => ({
    id: String(idx),
    name: c.name,
    slug: TITLE_TO_SLUG[c.name] ?? 'OTHER',
  }));

  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) router.push('/(login)');
    else router.push('/(addProduct)');
  }, [router]);

  const handlePressProduct = useCallback(
    async (id: string) => {
      const productId = Number(id);
      router.push({ pathname: "/(addProduct)/detail", params: { productId: String(productId) } });
    },
    [router]
  );

  const onTabPress = (tab: string) => setActiveTab(tab);

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

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
            <NewProductsSection products={products} onPress={handlePressProduct} />
          )}

          {/* 로딩 중에도 자리 유지하고 싶으면 이 섹션은 항상 렌더 */}
          <CategorySection
            categories={recentCategoriesForSection}
            loading={isLoading}
            onPressHeaderRight={() => router.push("/(category)")} // /(category)/index.tsx
            onPressCategory={(slug) =>
              router.push({ pathname: "/(category)/[slug]", params: { slug } })
            }
          />
        </ScrollView>

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
