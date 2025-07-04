import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 타입 정의
interface Product {
  id: string;
  name: string;
  price: string;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ProductCardProps {
  item: Product;
}

interface CategoryItemProps {
  item: Category;
}

export default function HomeScreen() {
  // 상품 데이터
  const products: Product[] = [
    { id: '1', name: '상품명...', price: '99,000원' },
    { id: '2', name: '상품명...', price: '99,000원' },
    { id: '3', name: '상품명...', price: '99,000원' },
    { id: '4', name: '상품명...', price: '99,000원' },
    { id: '5', name: '상품명...', price: '99,000원' },
    { id: '6', name: '상품명...', price: '99,000원' },
  ];

  // 카테고리 데이터
  const categories: Category[] = [
    { id: '1', name: '식품/건강', icon: 'restaurant' },
    { id: '2', name: 'IT/가전', icon: 'laptop' },
    { id: '3', name: '화장/유아', icon: 'happy' },
    { id: '4', name: '패션잡화', icon: 'shirt' },
  ];

  const ProductCard: React.FC<ProductCardProps> = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        // 상품 상세 페이지로 이동
        router.push(`/product/${item.id}`);
      }}
    >
      <View style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const CategoryItem: React.FC<CategoryItemProps> = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => {
        // 카테고리 페이지로 이동
        router.push(`/category/${item.id}`);
      }}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="#666" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct: ListRenderItem<Product> = ({ item }) => (
    <ProductCard item={item} />
  );

  const renderCategory: ListRenderItem<Category> = ({ item }) => (
    <CategoryItem item={item} />
  );

  const handleSearch = (): void => {
    // 검색 페이지로 이동
    router.push('/search');
  };

  const handleAddProduct = (): void => {
    // 상품 등록 페이지로 이동
    router.push('/addProduct');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchContainer} onPress={handleAddProduct}>
          <Ionicons name="add-circle" size={20} color="#333" />
          <Text style={styles.searchText}>내 물품 등록하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 오늘 새로 올라왔어요 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>오늘 새로 올라왔어요</Text>
            <TouchableOpacity onPress={() => router.push('/products/new')}>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item: Product) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* 카테고리별 보기 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>카테고리별 보기</Text>
            <Text style={styles.sectionSubtitle}>최근 본 카테고리에요</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item: Category) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  productsGrid: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '31%',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});