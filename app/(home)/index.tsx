// home.tsx
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '../components/atoms/SearchBar';
import RegisterItemButton from '../components/atoms/Button';
import NewProductsSection from '../components/organisms/NewProductsSection';
import CategorySection from '../components/organisms/CategorySection';
import BottomTabBar from '../components/molecules/BottomTabBar';   // 하단 탭바
import { tokenStore } from '../auth/tokenStore';
import { images } from '../../assets/imageRegistry';
import { categoryIcons } from '../../assets/categoryIcons';

const todayProducts = [
  { id: '1', name: '청바지 팔아요',       price: '9,000원',  image: images.jeans },
  { id: '2', name: '노트북 13인치',       price: '99,000원', image: images.laptop13 },
  { id: '3', name: '미니 휴대용 드라이어', price: '10,000원', image: images.miniDryer },
  { id: '4', name: '전기포트 나눔해요',    price: '0원',     image: images.kettle },
  { id: '5', name: '흰색 스커트 팬츠',     price: '8,000원',  image: images.whiteSkirt },
  { id: '6', name: '레더자켓 프리미엄',    price: '19,000원', image: images.leatherJacket },
];

const PHONE_WIDTH = 390;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home'); // 홈

  const handleRegisterPress = useCallback(async () => {
    const token = await tokenStore.get();
    if (!token) router.push('/(login)');
    else router.push('/(addProduct)');
  }, []);

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
          <SearchBar />
          <RegisterItemButton
            variant="registerItem"
            text="내 물품 등록하기"
            onPress={handleRegisterPress}
          />
          <NewProductsSection products={todayProducts} />
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
