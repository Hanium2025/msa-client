import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet, Platform } from "react-native";
import WaybillRegister from "../components/organisms/WaybillRegister";
import BottomTabBar from "../components/molecules/BottomTabBar";

const PHONE_WIDTH = 393;

export default function WaybillRegisterScreen() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <WaybillRegister
          onSubmit={(payload) => {
            // TODO: API 연동
            console.log("송장 등록:", payload);
          }}
        />
        <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
});
