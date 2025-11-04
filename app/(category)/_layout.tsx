import React, { useState } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Slot } from "expo-router";
import BottomTabBar from "../components/molecules/BottomTabBar";

const PHONE_WIDTH = 390; // home.tsx 기준
const TABBAR_SPACE = 90;

export default function CategoryLayout() {
  const [activeTab, setActiveTab] =
    useState<"notifications" | "chat" | "home" | "community" | "profile">("home");

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 탭바에 가리지 않게 하단 여백 확보 */}
        <View style={[styles.content, { paddingBottom: TABBAR_SPACE }]}>
          <Slot />
        </View>

        {/* 고정 하단 탭바 */}
        <BottomTabBar activeTab={activeTab} onTabPress={(t) => setActiveTab(t as any)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    width: Platform.OS === "web" ? PHONE_WIDTH : "100%", // 모바일은 화면 꽉 채움
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: Platform.OS === "web" ? "center" : "stretch", // 모바일에서는 stretch
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
  content: {
    flex: 1,
  },
});
