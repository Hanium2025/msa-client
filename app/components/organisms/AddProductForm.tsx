import React, { useState } from 'react';
import { Alert, ScrollView, View, StyleSheet } from 'react-native';
import Button from '../atoms/Button';  // Button 임포트
import { Input } from '../atoms/Input';
import RegisterLabel from '../atoms/Label';  // RegisterLabel 임포트
import { CategoryDropdown } from '../molecules/CategoryDropdown';
import { ImageUploader } from '../molecules/ImageUploader';
import { PriceInput } from '../molecules/PriceInput';
import { useAddProduct } from '../../hooks/useAddProduct';

export const AddProductForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('99,000');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [images, setImages] = useState<File[]>([]); // ImageUploader로부터 파일 배열 받기

  const { mutate } = useAddProduct();

  const handleRegister = async () => {
    console.log(`업로드할 이미지 개수: ${images.length}`);

    const productData = {
      title,
      content,
      price: parseInt(price.replace(/[^0-9]/g, ''), 10),
      category,
    };

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoxLCJleHAiOjE3NTQ2NjYxOTgsImVtYWlsIjoiaGVsbG9AZW1haWwuY29tIn0.j--6FmAhA7rYZh2AmGm5yQ2iqLxMAKdWpLHuv-aHKxMJXzZkyuSnY3CUuTqGoS7z2KT68tgkHc-kot5CrneYEA';

    const formData = new FormData();

    // JSON 문자열 그대로 추가
    formData.append('json', JSON.stringify(productData));

    // 이미지 처리 (0개여도 반드시 키 포함)
    if (images.length === 0) {
      // 빈 Blob을 사용하는 게 더 안전한 방법
      formData.append('images', new Blob([]));
    } else {
      images.forEach((image, idx) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: image.name,
        });
      });
    }

    for (const [key, value] of formData.entries()) {
      console.log(`🧾 ${key}:`, value);
    }

    // 서버로 전송
    mutate(
      { formData, token },
      {
        onSuccess: (res) => Alert.alert('등록 완료', res.message),
        onError: (err) => {
          console.error('등록 에러:', err.response?.data);
          Alert.alert('오류', err.response?.data?.message || '상품 등록 실패');
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formWrapper}>
        <ImageUploader images={images} setImages={setImages} />

        <View style={{ marginTop: 24 }}>
          <RegisterLabel required text="상품명" />
          <Input
            placeholder="상품명을 입력하세요"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <PriceInput price={price} onChangePrice={setPrice} />
        <CategoryDropdown selected={category} onSelect={setCategory} />

        <View style={{ marginTop: 24 }}>
          <RegisterLabel text="상세설명" />
          <Input
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={{ marginVertical: 24 }}>
          <Button text="등록하기" variant="registerItem" onPress={handleRegister} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 393,
  },
});
