import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./BottomButtonGroup.style";
import CreateChatroomButton from "../../atoms/CreateChatroomButton/CreateChatroomButton";
interface Props {
  status: "ON_SALE" | "IN_PROGRESS" | "SOLD_OUT";
  onChat: () => void;
}

export default function BottomButtonGroup({
  status,
  productId,
  receiverId,
  token,
}: Props) {
  let statusText = "";
  switch (status) {
    case "ON_SALE":
      statusText = "판매 중";
      break;
    case "IN_PROGRESS":
      statusText = "거래 중";
      break;
    case "SOLD_OUT":
      statusText = "거래 완료";
      break;
  }

  const isSoldOut = status === "SOLD_OUT";

  return (
    <View style={styles.container}>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
      <CreateChatroomButton
        productId={productId}
        receiverId={receiverId}
        token={token}
        label="판매자와 채팅하기"
        // 스타일을 기존 버튼 스타일에 맞춰 전달 (선택)
        style={styles.buttonDark}
        // 품절이면 비활성화하고 싶다면, 컴포넌트에 disabled prop을 추가해도 됨
        // 여기서는 간단히 label만 바꾸거나 스타일을 회색으로 덮어씌워도 OK
        onCreated={(roomId) => {
          // 필요 시 트래킹/로깅
          // console.log('created chatroom:', roomId);
        }}
      />
    </View>
  );
}
