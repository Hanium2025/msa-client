// app/payments/fail.tsx
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import PaymentFail from "../components/organisms/PaymentFail";

export default function PaymentFailPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <PaymentFail />
    </SafeAreaView>
  );
}
