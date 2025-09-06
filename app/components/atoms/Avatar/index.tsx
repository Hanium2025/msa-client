import React from "react";
import { Image, View, StyleSheet } from "react-native";
//채팅방 리스트 상대방 프로필 이미지
type Props = { uri?: string; size?: number };

export default function Avatar({ uri, size }: Props) {
  const style = { width: size, height: size, borderRadius: size / 2 };
  return uri ? (
    <Image source={{ uri }} style={[styles.img, style]} />
  ) : (
    <View style={[styles.fallback, style]} />
  );
}

const styles = StyleSheet.create({
  img: { backgroundColor: "#eee" },
  fallback: { backgroundColor: "#ddd" },
});
