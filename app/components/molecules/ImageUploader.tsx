import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

export const ImageUploader = () => {
  const handleUpload = () => {
    Alert.alert('이미지 업로드', '이미지를 선택해주세요.');
  };

  return (
    <View style={{ marginTop: 24 }}>
      <TouchableOpacity onPress={handleUpload} style={{
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
      }}>
        <Ionicons name="camera-outline" size={40} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
};
