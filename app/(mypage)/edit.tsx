import React, { useState } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ProfileEdit from "../components/organisms/ProfileEdit";
import BottomTabBar from "../components/molecules/BottomTabBar";
import { useMyPage } from "../hooks/useMypage"; 
import { ActivityIndicator } from "react-native"; 
import { useProfileEdit } from "../hooks/useProfileEdit";

const PHONE_WIDTH = 393;

export default function ProfileEditScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  const { profile, loading } = useMyPage();
  
  const { updateProfile, isUpdating } = useProfileEdit();

  const onTabPress = (tab: string) => setActiveTab(tab);

  const TAB_BAR_H = 64;
  const bottomPad = TAB_BAR_H + (insets?.bottom ?? 0) + 12;

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleProfileSubmit = (data: { nickname: string; newLocalAvatarUri?: string; isAvatarChanged: boolean }) => {
    updateProfile(
      {
        nickname: data.nickname,
        newLocalAvatarUri: data.newLocalAvatarUri,
        originalAvatarUrl: profile.imageUrl,
      },
      {
        // 업데이트 성공 시 실행될 콜백
        onSuccess: () => {
          Alert.alert("성공", "프로필이 성공적으로 업데이트되었습니다.");
          router.back(); // 이전 화면으로 돌아가기
        },
      }
    );
  };

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />

        {/* 콘텐츠 */}
        <ProfileEdit
          defaultNickname={profile.nickname}
          defaultAvatarUri={profile.imageUrl}
          onBack={() => router.back()}
          onSubmit={handleProfileSubmit}
          bottomPadding={bottomPad}
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
