import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { SafeAreaView, View, ActivityIndicator, StyleSheet, Text, ImageSourcePropType, Platform, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductGrid } from "../components/organisms/ProductGrid";
import type { ProductItem } from "../components/molecules/ProductCard"
import { SearchBar } from "../components/atoms/SearchBar";
import BottomTabBar from '../components/molecules/BottomTabBar';
import { getProductsByKeywordList, ServerSort } from "../lib/api/product-search";

type SortKey = "new" | "popular";
const PHONE_WIDTH = 390;
const IMAGE_BASE = "https://msa-image-bucket.s3.ap-northeast-2.amazonaws.com";
const toAbsoluteUrl = (u?: string) =>
  !u ? undefined : /^https?:\/\//i.test(u) ? u : `${IMAGE_BASE}${u.startsWith("/") ? "" : "/"}${u}`;

export default function KeywordResultScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const { keyword: _keyword } = useLocalSearchParams<{ keyword?: string }>();
  const keyword = useMemo(() => String(_keyword ?? ""), [_keyword]);

  const [sort, setSort] = useState<SortKey>("new");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const onTabPress = (tab: string) => {
    setActiveTab(tab);
    // 필요하면 라우팅 연결
    // if (tab === 'profile') router.push('/(me)');
  };

  const toServerSort = (s: SortKey): ServerSort => (s === "new" ? "recent" : "like");

  const fetchProducts = useCallback(async () => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);
      setError(null);

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;


      const result = await getProductsByKeywordList({
        keyword,
        sort: toServerSort(sort),
        page: 0,
        signal: ac.signal,
      });

      // getProductsByKeywordList가 배열/ApiResponse 모두 대비
      const list = Array.isArray(result) ? result : (result?.data ?? result?.data?.data ?? []);

      const mapped: ProductItem[] = list.map((p: any) => ({
        id: p.productId,
        title: p.title,
        price: p.price,
        imageUrl: toAbsoluteUrl(p.imageUrl),
      }));

      setProducts(mapped);
    } catch (e: any) {
      if (e?.name === "CanceledError" || e?.message === "canceled") return;
      setError(e?.message ?? "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }, [keyword, sort]);

  useEffect(() => {
    fetchProducts();
    return () => abortRef.current?.abort();
  }, [fetchProducts]);

  const handleChangeSort = useCallback((s: SortKey) => {
    setSort(s); // sort 바뀌면 fetchProducts가 다시 호출됨
  }, []);

  const handlePressProduct = useCallback(
    (id: number) => {
      router.push({
      pathname: "/(addProduct)/detail",
      params: { productId: String(id) },
    });
    },
    [router]
  );

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
            <SearchBar
              onTrigger={() => router.push("/(productSearch)")}
            />

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