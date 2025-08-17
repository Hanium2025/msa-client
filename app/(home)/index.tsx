import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import RegisterItemButton from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';
import { tokenStore } from '../auth/tokenStore';

const PHONE_WIDTH = 390;   // iPhone 14 Pro width

export default function HomeScreen() {
  const router = useRouter();

  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) router.push('/(beforeLogin)');
    else router.push('/(addProduct)');
  }, []);

  const products = Array.from({ length: 6 }).map((_, i) => ({
    id: i.toString(),
    name: '상품명',
    price: '99,000원',
  }));

  const categories = [
    { id: '1', name: '식물/원예' },
    { id: '2', name: 'IT/가전' },
    { id: '3', name: '명품/쥬얼리' },
    { id: '4', name: '패션잡화' },
  ];

  return (
    // 웹: 바깥은 flex:1로 화면 전체 차지 + 가운데 정렬
    <View style={styles.webRoot}>
      {/* 폰 프레임: 웹에선 390 고정폭, 네이티브에선 flex:1 */}
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <SearchBar />
        <RegisterItemButton
          variant="registerItem"
          text="내 물품 등록하기"
          onPress={handleRegisterPress}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <NewProductsSection products={products} />
          <CategorySection categories={categories} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    // 웹일 때만 회색 배경
    backgroundColor: Platform.OS === 'web' ? '#F5F6F7' : '#fff',
    alignItems: 'center',        // 가로 가운데
    justifyContent: 'flex-start' // 세로 위에서 시작
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: '#fff',
    // 웹에서만 390px로 폭 제한하고 가운데 두기
    maxWidth: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    width: Platform.OS === 'web' ? PHONE_WIDTH : undefined,
    alignSelf: 'center',
    // (웹에서도 적용 가능)
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
  },
});
