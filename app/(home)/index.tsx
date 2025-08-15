import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import RegisterItemButton from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';
import { tokenStore } from '../auth/tokenStore';

export default function HomeScreen() {
  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) {
      router.push('/(beforeLogin)');
    } else {
      router.push('/(addProduct)'); // 등록 페이지 경로에 맞게
    }
  }, []);

  const products = Array.from({ length: 6 }).map((_, i) => ({
    id: i.toString(),
    name: '상품명...',
    price: '99,000원',
  }));

  const categories = [
    { id: '1', name: '식물/원예' },
    { id: '2', name: 'IT/가전' },
    { id: '3', name: '명품/쥬얼리' },
    { id: '4', name: '패션잡화' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SearchBar />
      <RegisterItemButton text="상품 등록" onPress={handleRegisterPress} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <NewProductsSection products={products} />
        <CategorySection categories={categories} />
      </ScrollView>
    </SafeAreaView>
  );
}
