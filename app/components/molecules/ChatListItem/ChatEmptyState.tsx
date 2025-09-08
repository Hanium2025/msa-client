import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ChatEmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>아직 채팅방이 없어요</Text>
      <Text style={styles.desc}>
        상품 상세에서 “판매자와 채팅하기”를 누르면 채팅방이 생성돼요.
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={onBrowse}
        activeOpacity={0.8}
      >
        <Text style={styles.btnTxt}>상품 보러가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 8 },
  desc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#111",
  },
  btnTxt: { color: "#fff", fontWeight: "700" },
});
