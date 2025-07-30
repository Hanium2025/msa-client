import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ProductCard from '../components/organisms/ProductCard';
import BottomButtonGroup from '../components/molecules/BottomButtonGroup';

export default function DetailScreen() {
  const product = {
    id: '1234',
    title: '상품명',
    price: 99000,
    category: 'IT/가전',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    user: {
      nickname: '홍길동',
      postedAt: '10분 전',
    },
    status: 'ON_SALE', // 'IN_PROGRESS' | 'SOLD_OUT'
    likeCount: 222,
    images: ['', '', ''],
  };

  const handleChat = () => {
    console.log('채팅하기 클릭');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProductCard product={product} />
        <BottomButtonGroup
          status={product.status}
          onChat={handleChat}
        />
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
