// home.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform, ActivityIndicator,
  Text, } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import RegisterItemButton from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';
import BottomTabBar from '../components/molecules/BottomTabBar';   // 하단 탭바
import { tokenStore } from '../auth/tokenStore';
import { categoryIcons } from '../../assets/categoryIcons';
import { useHomeProducts } from "../hooks/useHomeProduct";
import { fetchProductDetail } from "../lib/api/product";


const PHONE_WIDTH = 390;

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
  const [activeTab, setActiveTab] = useState('home'); // 홈

  const { data: products, isLoading, error } = useHomeProducts();

  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) router.push('/(login)');
    else router.push('/(addProduct)');
  }, []);

  const goSearch = () => {
  // (productSearch)/index.tsx 로 이동
  // 폴더가 app/(productSearch)/index.tsx 라면 아래 둘 중 하나로 이동 가능
  router.push("/(productSearch)");          // 폴더 인덱스
  // 또는 라우트 별칭이 /product/search 라면: router.push("/product/search");
  };


  // 상세 조회
  const handlePressProduct = useCallback(
    async (id: string) => {
      const productId = Number(id);
      const token = await tokenStore.get();

      // 비로그인: 상세로
      if (!token) {
        router.push({ pathname: "/(addProduct)/detail", params: { productId: String(productId) } });
        return;
      }

      // 내 ID 파싱 시도 (실패해도 상세로 fallback)
      const myId = getUserIdFromToken(token);

      try {
        const detail = await fetchProductDetail(productId, token);
        const sellerId = Number(detail?.sellerId);

        if (myId && sellerId === myId) {
          router.push(`/(addProduct)/owner/${productId}`);
        } else {
          router.push({ pathname: "/(addProduct)/detail", params: { productId: String(productId) } });
        }
      } catch {
        // 상세 조회 실패 시에도 일반 상세로
        router.push({ pathname: "/(addProduct)/detail", params: { productId: String(productId) } });
      }
    },
    [router]
  );

  const categories = [
    { id: '1', name: '옷, 잡화, 장신구', icon: categoryIcons.clothes },
    { id: '2', name: 'IT, 전자제품',     icon: categoryIcons.electronics },
    { id: '3', name: '도서, 학습 용품',   icon: categoryIcons.books },
    { id: '4', name: '기타',             icon: categoryIcons.etc },
  ];

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    // 필요하면 라우팅 연결
    // if (tab === 'profile') router.push('/(me)');
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 스크롤 영역 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12 }} // 탭바와 살짝 간격
          showsVerticalScrollIndicator={false}
        >
          <SearchBar onTrigger={goSearch} />
          <RegisterItemButton
            variant="registerItem"
            text="내 물품 등록하기"
            onPress={handleRegisterPress}
          />
          {/* 상품 섹션만 API로 교체 */}
          {isLoading ? (
            <View style={{ paddingVertical: 24, alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
              <Text>상품을 불러오지 못했습니다.</Text>
            </View>
          ) : (
             <NewProductsSection products={products ?? []} onPress={handlePressProduct} />
          )}
          <CategorySection categories={categories} />
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