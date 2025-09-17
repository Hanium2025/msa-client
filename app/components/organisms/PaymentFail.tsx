// components/organisms/PaymentFail/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Heading from "../atoms/Heading";
import SadFace from "../atoms/SadFace";
import Button from "../atoms/Button";

export default function PaymentFail() {
  const router = useRouter();
  return (
    <View style={s.wrap}>
      <View style={s.hero}>
        <Heading>결제에 실패했어요</Heading>
        <SadFace />
        <Button
          text="다시 시도하기"
          variant="paymentRetry"
          onPress={() => router.replace("/(payment)")}
          style={s.retryBtn}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",   
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: "center",
    gap: 12,                    
  },
  retryBtn: {
    marginTop: 8,            
    alignSelf: "center",
  },
});
