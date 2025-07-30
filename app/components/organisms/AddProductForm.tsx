import React, { useState } from 'react';
import { Alert, ScrollView, View, StyleSheet } from 'react-native';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { CategoryDropdown } from '../molecules/CategoryDropdown';
import { ImageUploader } from '../molecules/ImageUploader';
import { PriceInput } from '../molecules/PriceInput';


export const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('99,000');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('카테고리명');

  const handleRegister = () => {
    if (!productName.trim()) {
      Alert.alert('알림', '상품명을 입력해주세요.');
      return;
    }
    Alert.alert('등록 완료', '상품이 성공적으로 등록되었습니다.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formWrapper}>
        <ImageUploader />
        <View style={{ marginTop: 24 }}>
          <Label required text="상품명" />
          <Input
            placeholder="상품명을 입력하세요"
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        <PriceInput price={price} onChangePrice={setPrice} />
        <CategoryDropdown selected={selectedCategory} onSelect={setSelectedCategory} />

        <View style={{ marginTop: 24 }}>
          <Label text="상세설명" />
          <Input
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={{ marginVertical: 24 }}>
          <Button text="등록하기" onPress={handleRegister} />
        </View>
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // center horizontally
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 393, // ✅ iPhone 화면 너비에 맞게 제한
  },
});

