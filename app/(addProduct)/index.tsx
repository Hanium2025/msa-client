import React from 'react';
import { SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import { AddProductForm } from '../components/organisms/AddProductForm';
import { useRequireToken } from '../auth/useRequireToken';

export default function AddProductScreen() {
  const ready = useRequireToken();

  if (!ready) {
    // 토큰 확인 중일 때 잠깐 로딩 표시
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AddProductForm />
    </SafeAreaView>
  );
}
