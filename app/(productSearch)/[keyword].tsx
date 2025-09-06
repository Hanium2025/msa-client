import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, ActivityIndicator, StyleSheet, Text, ImageSourcePropType, Platform, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductGrid } from "../components/organisms/ProductGrid";
import type { ProductItem } from "../components/molecules/ProductCard"
import { SearchBar } from "react-native-screens";
import BottomTabBar from '../components/molecules/BottomTabBar'; 

type SortKey = "new" | "popular";
const PHONE_WIDTH = 390;

export default function KeywordResultScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const { keyword: _keyword } = useLocalSearchParams<{ keyword?: string }>();
  const keyword = useMemo(() => String(_keyword ?? ""), [_keyword]);

  const [sort, setSort] = useState<SortKey>("new");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    // 필요하면 라우팅 연결
    // if (tab === 'profile') router.push('/(me)');
  };

  // TODO: 실제 아이콘 이미지 경로로 교체
//   const iconSource = useMemo<ImageSourcePropType>(
//     () => require("../../../assets/icons/search.png"),
//     []
//   );

  const fetchProducts = useCallback(async () => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);
      setError(null);

      // TODO: 실제 API로 교체하세요.
      // 예: const res = await fetch(`${API}/products?keyword=${encodeURIComponent(keyword)}&sort=${sort}`);
      // const data = await res.json();

      // 데모용 목업 데이터
      const mock: ProductItem[] = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        title: `${keyword} 상품명 ABCDE`,
        price: 99000,
        // ProductCard에서 요구하는 필드를 맞춰주세요.
        // 예: thumbnail: "https://picsum.photos/seed/"+(i+1)+"/300/300"
        thumbnail: undefined,
      }));

      // 정렬 데모 (서버가 정렬해 주면 불필요)
      const sorted =
        sort === "popular"
          ? mock.slice().reverse()
          : mock;

      setProducts(sorted);
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [keyword, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChangeSort = useCallback((s: SortKey) => {
    setSort(s);
    // 서버 정렬이면 여기서만 상태 바꾸고 fetchProducts에서 반영
  }, []);

  const handlePressProduct = useCallback((id: number) => {
    // 상품 상세로 이동
    router.push({ pathname: "/product/[id]", params: { id: String(id) } });
  }, [router]);

  if (!keyword.trim()) {
    return (
      <SafeAreaView style={styles.webRoot}>
        <View style={styles.center}>
          <Text>검색어가 비어 있습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
            {loading && products.length === 0 ? (
              <View style={styles.center}>
                <ActivityIndicator />
              </View>
            ) : error ? (
              <View style={styles.center}>
                <Text>오류가 발생했어요: {error}</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.center}>
                <Text>‘{keyword}’에 대한 결과가 없어요.</Text>
              </View>
            ) : (
                <>
              <SearchBar/>

              <ProductGrid
              //   title={keyword}                 // 헤더 타이틀에 검색어 표시
              //   iconSource={iconSource}         // 상단 아이콘
              sort={sort}                     // 현재 정렬 상태
              onChangeSort={handleChangeSort} // 탭 전환 시
              products={products}             // 목록 데이터
              onPressProduct={handlePressProduct}
              />
              </>
            )}
            
            
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
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});