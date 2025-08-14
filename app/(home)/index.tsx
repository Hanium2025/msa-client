import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { router } from 'expo-router';

import { SearchBar } from '../components/atoms/SearchBar';
import { RegisterItemButton } from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';

export default function HomeScreen() {
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
      <RegisterItemButton onPress={() => router.push('/addProduct')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <NewProductsSection products={products} />
        <CategorySection categories={categories} />
      </ScrollView>
    </SafeAreaView>
  );
}
