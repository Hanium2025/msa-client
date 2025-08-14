import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ProductCard from '../components/organisms/ProductCard';
import ProductOwnerActions from '../components/organisms/ProductOwnerActions';

export default function DetailOwnerScreen() {
  const product = {
    id: '1234',
    title: '상품명',
    price: 99000,
    category: 'IT/가전',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
    user: {
      nickname: '홍길동',
      postedAt: '10분 전',
    },
    status: 'ON_SALE',
    likeCount: 222,
    images: ['', '', ''],
  };

  const handleEdit = () => {
    console.log('수정하기 클릭');
  };

  const handleDelete = () => {
    console.log('삭제하기 클릭');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProductCard product={product} />
        <ProductOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    paddingBottom: 32,
  },
});
