// app/(addProduct)/index.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

import AddProductForm, { AddProductFormValues } from '../components/organisms/AddProductForm';
import { useRequireToken } from '../auth/useRequireToken';
import { useAddProduct } from '../hooks/useAddProduct';
import { tokenStore } from '../auth/tokenStore';

const PHONE_WIDTH = 390; // iPhone 14 Pro width

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join('\n');
  if (Platform.OS === 'web') window.alert(text);
  else Alert.alert(title, message);
};

const koToEnum: Record<string, "TRAVEL" | "FEEDING" | "SLEEP" | "PLAY" | "LIVING" | "APPAREL" | "OTHER"> = {
  "이동·안전장비": "TRAVEL",
  "식사·수유·위생 가전": "FEEDING",
  "수면·안전": "SLEEP",
  "놀이·교육": "PLAY",
  "리빙·가구": "LIVING",
  "의류·잡화": "APPAREL",
  "기타": "OTHER",
};

export default function AddProductScreen() {
  const ready = useRequireToken();
  const router = useRouter();
  const { mutate, isPending } = useAddProduct();

  const [values, setValues] = useState<AddProductFormValues>({
    title: '',
    price: '',
    content: '',
    category: '선택',
    images: [],
  });
  const patch = (p: Partial<AddProductFormValues>) => setValues((v) => ({ ...v, ...p }));

  const handleSubmit = async () => {
    // 대표 이미지 1장 필수
    if (!values.images.length) {
      showAlert('대표 이미지 1장은 필수입니다.');
      return;
    }

    // 최대 5장
    if (values.images.length > 5) {
      showAlert('이미지는 최대 5개까지 업로드 가능합니다.');
      return;
    }

    const mappedCategory =
      (koToEnum[values.category] as keyof typeof koToEnum | undefined) ||
      (["TRAVEL","FEEDING","SLEEP","PLAY","LIVING","APPAREL","OTHER"].includes(values.category) ? values.category : undefined);

    if (!mappedCategory) {
      showAlert('카테고리를 선택해 주세요.', '허용: TRAVEL, FEEDING, SLEEP, PLAY, LIVING, APPAREL, OTHER');
      return;
    }

    const token = await tokenStore.get();
    if (!token) {
      showAlert('로그인이 필요합니다.');
      router.replace('/(login)');
      return;
    }

    const priceNumber = parseInt(values.price.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      showAlert('가격을 확인해 주세요.', '숫자만 입력 가능합니다.');
      return;
    }

    const productData = {
      title: values.title.trim(),
      content: values.content.trim(),
      price: priceNumber,
      category: mappedCategory, 
    };

    const formData = new FormData();
    formData.append('json', JSON.stringify(productData));

    values.images.forEach((img: any, idx: number) => {
      if (Platform.OS === 'web') {
        // File 객체
        formData.append('images', img as File, (img as File).name);
      } else {
        // RN FileLike
        formData.append('images', {
          uri: img.uri,
          name: img.name ?? `image_${idx}.jpg`,
          type: img.type ?? 'image/jpeg',
        } as any);
      }
    });

    mutate(
      { formData, token },
      {
        onSuccess: (res) => {
          const message = res?.message ?? '등록 성공';
          const productId = res?.data?.productId;
          if (!productId) {
            showAlert('등록 성공', '상품 ID를 가져오지 못했습니다.');
            return;
          }
          const goOwner = () =>
            router.replace({
              pathname: '/(addProduct)/owner/[productId]',
              params: { productId: String(productId) },
            });

          if (Platform.OS === 'web') {
            window.alert(message);
            goOwner();
          } else if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
            goOwner();
          } else {
            Alert.alert('등록 성공', message, [{ text: '확인', onPress: goOwner }]);
          }
        },
        onError: (err: unknown) => {
          let msg = '상품 등록 실패';
          if (axios.isAxiosError(err)) msg = err.response?.data?.message || err.message;
          else if (err instanceof Error) msg = err.message;
          Alert.alert('오류', msg);
        },
      }
    );
  };

  if (!ready) {
    return (
      <View style={styles.webRoot}>
        <SafeAreaView style={styles.phoneFrame}>
          <View style={styles.loadingBox}>
            <ActivityIndicator />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <AddProductForm
          values={values}
          onChange={patch}
          onSubmit={handleSubmit}
          submitting={isPending}
        />
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
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
