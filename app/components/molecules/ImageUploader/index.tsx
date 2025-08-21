// components/molecules/ImageUploader.tsx
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface ImageUploaderProps {
  images: (File | any)[];
  setImages: (files: (File | any)[]) => void;

  // 추가 옵션
  maxCount?: number;                     // 업로드 허용 최대 수 (미지정 시 5)
  buttonOnly?: boolean;                  // true면 버튼(+)만 렌더, 프리뷰는 렌더 X
  size?: { width: number; height: number }; // UI 크기 지정 (버튼/프리뷰 공통 기본값)
}

export const ImageUploader = ({
  images,
  setImages,
  maxCount = 5,
  buttonOnly = false,
  size = { width: 192, height: 124 },
}: ImageUploaderProps) => {
  const handleUpload = async () => {
    if (images.length >= maxCount) {
      Alert.alert(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      base64: false,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File(
          [blob],
          (asset as any).fileName || `image_${Date.now()}.jpg`,
          { type: blob.type || "image/jpeg" }
        );
        setImages([...images, file]); // 웹은 File
      } else {
        setImages([
          ...images,
          {
            uri: asset.uri,
            name: (asset as any).fileName || `image_${Date.now()}.jpg`,
            type: (asset as any).type || "image/jpeg",
          },
        ]); // RN은 {uri,name,type}
      }
    }
  };

  // 버튼만 (편집 페이지 + 타일 96x96 등에 사용)
  if (buttonOnly) {
    return (
      <TouchableOpacity
        onPress={handleUpload}
        style={[
          styles.uploadBox,
          {
            width: size.width,
            height: size.height,
          },
        ]}
        accessibilityLabel="이미지 추가"
      >
        <Ionicons name="camera-outline" size={40} color="#bbb" />
      </TouchableOpacity>
    );
  }

  // 기본(프리뷰 + 버튼)
  return (
    <View style={{ marginTop: 24 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img: any, index: number) => (
          <Image
            key={index}
            source={{
              uri: Platform.OS === "web" ? URL.createObjectURL(img) : img.uri,
            }}
            style={[
              styles.imagePreview,
              { width: size.width, height: size.height },
            ]}
          />
        ))}
        {images.length < maxCount && (
          <TouchableOpacity
            onPress={handleUpload}
            style={[
              styles.uploadBox,
              { width: size.width, height: size.height, marginLeft: images.length ? 10 : 0 },
            ]}
          >
            <Ionicons name="camera-outline" size={40} color="#bbb" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    borderRadius: 8,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
});
