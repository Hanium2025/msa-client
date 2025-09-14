import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProfileEdit from "../components/organisms/ProfileEdit";
import BottomTabBar from "../components/molecules/BottomTabBar";

const PHONE_WIDTH = 393; // iPhone 14 Pro

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const onTabPress = (tab: string) => setActiveTab(tab);

  const TAB_BAR_H = 64;
  const bottomPad = TAB_BAR_H + (insets?.bottom ?? 0) + 12;

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 콘텐츠 */}
        <ProfileEdit
          onBack={() => router.back()}
          onSubmit={(data) => console.log("저장", data)}
          bottomPadding={bottomPad}  // 탭바에 가리지 않도록
        />

        {/* 하단 탭바 */}
        <View style={[styles.tabWrap, { paddingBottom: (insets?.bottom ?? 0) }]}>
          <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
        </View>
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
  tabWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6E9EC",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
});
