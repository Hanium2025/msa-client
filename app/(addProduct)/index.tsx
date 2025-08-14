import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AddProductForm } from '../components/organisms/AddProductForm';

export default function AddProductScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AddProductForm />
    </SafeAreaView>
  );
}