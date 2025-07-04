import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomTabBar from '../(tabs)';

interface ProductDetailScreenProps {}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = () => {
  // 기본값을 하나의 탭으로 설정
  const [activeTab, setActiveTab] = useState('explore'); // 또는 적절한 기본 탭

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // 여기에 네비게이션 로직 추가
    console.log('Tab pressed:', tabName);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Image 
              source={require('../../assets/images/back.png')} 
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Title and Price */}
          <View style={styles.titleSection}>
            <Text style={styles.productTitle}>상품명</Text>
            <Text style={styles.price}>₩ 99,000</Text>
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar} />
              <View>
                <Text style={styles.userName}>홍길동</Text>
                <Text style={styles.userLocation}>10분 전</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryText}>IT/가전</Text>
            </TouchableOpacity>
          </View>

          {/* Product Images */}
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
            <View style={styles.imageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
          </View>

          {/* Product Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
              occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est 
              laborum.
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <Ionicons name="star" size={16} color="#ddd" />
            <Text style={styles.ratingText}>3</Text>
          </View>
          
          {/* 스크롤 시 하단 버튼과 탭바가 가려지지 않도록 여분 공간 추가 */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteText}>판매 중</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatText}>판매자와 채팅하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 하단 탭바 - SafeAreaView 외부에 위치 */}
      <BottomTabBar 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
    width: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#084C63',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  imageSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 100, // 하단 버튼과 탭바 높이만큼 여분 공간
  },
  bottomSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  chatButton: {
    flex: 2,
    backgroundColor: '#084C63',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  chatText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProductDetailScreen;