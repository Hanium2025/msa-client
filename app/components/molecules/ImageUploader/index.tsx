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
}

export const ImageUploader = ({ images, setImages }: ImageUploaderProps) => {
  const handleUpload = async () => {
    if (images.length >= 5) {
      Alert.alert("최대 5장까지 업로드할 수 있습니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ["images"],
      base64: false,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File(
          [blob],
          asset.fileName || `image_${Date.now()}.jpg`,
          { type: blob.type || "image/jpeg" }
        );
        setImages([...images, file]); // 웹은 File을 그대로 보관
      } else {
        setImages([
          ...images,
          {
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.type || "image/jpeg",
          },
        ]); // RN은 {uri,name,type}
      }
    }
  };

  return (
    <View style={{ marginTop: 24 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img: any, index: number) => (
          <Image
            key={index}
            source={{
              uri: Platform.OS === "web" ? URL.createObjectURL(img) : img.uri,
            }}
            style={styles.imagePreview}
          />
        ))}
        {images.length < 5 && (
          <TouchableOpacity onPress={handleUpload} style={styles.uploadBox}>
            <Ionicons name="camera-outline" size={40} color="#ccc" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    width: 192,
    height: 124,
    borderRadius: 8,
    marginRight: 10,
  },
  uploadBox: {
    width: 192,
    height: 124,
    marginLeft: 90,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
});