import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddProductScreen() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('99,000');
  const [selectedCategory, setSelectedCategory] = useState('카테고리명');
  const [description, setDescription] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    '식품/건강',
    'IT/가전',
    '화장/유아',
    '패션잡화',
    '생활용품',
    '도서/문구',
  ];

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = () => {
    // 이미지 업로드 로직
    Alert.alert('이미지 업로드', '이미지를 선택해주세요.');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleRegister = () => {
    if (!productName.trim()) {
      Alert.alert('알림', '상품명을 입력해주세요.');
      return;
    }
    
    Alert.alert('등록 완료', '상품이 성공적으로 등록되었습니다.', [
      {
        text: '확인',
        onPress: () => router.back(),
      },
    ]);
  };

  const formatPrice = (text: string) => {
    // 숫자만 추출
    const numericValue = text.replace(/[^0-9]/g, '');
    // 천 단위 콤마 추가
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const handlePriceChange = (text: string) => {
    const formatted = formatPrice(text);
    setPrice(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 대표사진 */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>
            <Text style={styles.required}>* </Text>
            대표사진
          </Text>
          <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImageUpload}>
            <View style={styles.imageUploadBox}>
              <Ionicons name="camera-outline" size={40} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 상품명 */}
        <View style={styles.inputSection}>
          <Text style={styles.inlineLabel}>
            <Text style={styles.required}>* </Text>
            상품명
          </Text>
          <TextInput
            style={styles.inlineTextInput}
            value={productName}
            onChangeText={setProductName}
            placeholder="Value"
            placeholderTextColor="#ccc"
          />
        </View>

        {/* 가격 */}
        <View style={styles.inputSection}>
          <Text style={styles.inlineLabel}>
            <Text style={styles.required}>* </Text>
            가격
          </Text>
          <View style={styles.inlinePriceContainer}>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={handlePriceChange}
              keyboardType="numeric"
              placeholder="0"
            />
            <TouchableOpacity style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 카테고리 */}
        <View style={styles.inputSection}>
          <Text style={styles.inlineLabel}>
            <Text style={styles.required}>* </Text>
            카테고리
          </Text>
          <TouchableOpacity 
            style={styles.inlineDropdownContainer}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
            <Ionicons 
              name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        {showCategoryDropdown && (
          <View style={styles.dropdownList}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.dropdownItemText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}


        {/* 상세설명 */}
        <View style={styles.section}>
          <Text style={styles.label}>상세설명</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>395/1000</Text>
        </View>
      </ScrollView>

      {/* 등록하기 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRight: {
    flex: 1,
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 10,
    marginBottom: 24,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  inlineLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    width: 80,
  },
  required: {
    color: '#ff4444',
  },
  imageUploadContainer: {
    position: 'relative',
    marginLeft: 80,
  },
  imageUploadBox: {
    width: 192,
    height: 124,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  inlineTextInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  inlinePriceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 16,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  inlineDropdownContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginLeft: 96,
    marginBottom: 0,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
  },
  registerButton: {
    backgroundColor: '#023047',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#C1F209',
  },
});