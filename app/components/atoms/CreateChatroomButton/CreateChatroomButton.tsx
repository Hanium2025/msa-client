import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createChatroom } from "../../../lib/api/chat";

type Props = {
  productId: number;
  receiverId: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
  token?: string;
};

export default function CreateChatroomButton({
  productId,
  receiverId,
  label = "판매자와 채팅하기",
  style,
  token,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const t =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImlkIjoyLCJleHAiOjE3NTU3NjUwMjYsImVtYWlsIjoiaGVsbG8yQGVtYWlsLmNvbSJ9.BNZTDQvSzsENf2tr5ENZU2as5TvsH21I1lO-B25o0GsFtacZDQYaGYUVf0lUxUzvsvngvTxZVW2DfMkj4xZkuQ";
      const { chatroomId } = await createChatroom({ productId, receiverId }, t);
      router.push({
        pathname: "/chat/[chatroomId]",
        params: { chatroomId: String(id) }, // 쿼리로 전달
      });
    } catch (e: any) {
      Alert.alert("실패", e?.message ?? "채팅방 생성에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
      style={[styles.btn, style]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.txt}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    // --- 디자인 스펙 반영 ---
    width: 219,
    height: 40,
    borderRadius: 20, // border-radius: 20px
    borderWidth: 1, // border: 1px solid rgba(217,217,217,0.7)
    borderColor: "rgba(217, 217, 217, 0.70)",
    backgroundColor: "#084C63", // background: #084C63
    // display:flex + center
    justifyContent: "center",
    alignItems: "center",
    // box-shadow: 0 3px 15px rgba(0,0,0,0.3)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10, // Android 그림자
    // gap은 RN에선 불필요(자식이 하나뿐)
    // padding은 높이 지정했기 때문에 별도 지정 불필요
  },
  txt: {
    color: "#fff",
    fontWeight: "700",
  },
});
