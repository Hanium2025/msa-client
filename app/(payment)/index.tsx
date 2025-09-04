import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import ShippingInfo from "../components/organisms/ShippingInfo";

const PHONE_WIDTH = 390; // iPhone width

const showAlert = (title: string, message?: string) => {
  const text = [title, message].filter(Boolean).join("\n");
  if (Platform.OS === "web") window.alert(text);
  else Alert.alert(title, message);
};

export default function PaymentScreen() {
  return (
    <SafeAreaView
      style={{ width: 393, alignSelf: "center", marginVertical: 20 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.paymentInfo}>
          <ShippingInfo />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    display: "flex",
    width: 380,
    height: 900,
    flexDirection: "column",
    alignItems: "center",
    gap: 40,
    flexShrink: 0,
  },
  paymentInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
  },
});
