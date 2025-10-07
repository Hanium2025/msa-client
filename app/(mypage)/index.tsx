import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import ProfileCard from "../components/molecules/ProfileCard";
import BottomTabBar from "../components/molecules/BottomTabBar";
import MyPageSections from "../components/organisms/MyPageSections";
import { useMyPage } from "../hooks/useMypage";
import { logout as apiLogout } from "../lib/api/user";

const PHONE_WIDTH = 390;

export default function MyPageScreen() {
  const {
    profile,
    loading,
    error,
    setMarketingAgree,
    setThirdPartyAgree,
    deleteAccount,
    changingMarketing,
    changingThird,
  } = useMyPage();

  const [activeTab, setActiveTab] = useState("profile");
  const onTabPress = (tab: string) => setActiveTab(tab);

  // 에러 안내(있으면 한 번만)
  if (error) {
    Alert.alert("오류", error);
  }

  const name = profile?.nickname ?? "";
  const categories = profile?.mainCategory ?? [];
  const trust = profile?.score ?? 0;
  const avatar = profile?.imageUrl;

  return (
    <SafeAreaView style={s.phoneFrame}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={s.title}>마이페이지</Text>
        </View>

        <View style={s.cardWrap}>
          <ProfileCard
            name={profile?.nickname ?? ""}
            mainCategories={profile?.mainCategory ?? []}
            trustScore={profile?.score ?? 0}
            avatarSource={
              profile?.imageUrl ||
              require("../../assets/images/default-avatar.png")
            }
            onPressProfile={() => {}}
          />
        </View>

        <View style={s.sectionsWrap}>
          <MyPageSections
            tradeHandlers={{
              onPressSales: () => router.push("/(sold)"),
              onPressPurchases: () => router.push("/(purchased)"),
              onPressFavorites: () => router.push("/(favorites)"),
            }}
            communityHandlers={{
              onPressMyPosts: () => router.push("/(community)/my-posts"),
              onPressMyComments: () => router.push("/(community)/my-comments"),
              onPressMyLikes: () => router.push("/(community)/my-likes"),
            }}
            accountHandlers={{
              onPressChangePassword: () =>
                router.push("/(profile)/change-password"),
              onPressEditProfile: () => router.push("/(profile)/edit"),

              // 로그아웃 → 토큰 정리 후 로그인 화면으로
              onPressLogout: async () => {
                try {
                  await apiLogout();
                } finally {
                  router.replace("/(login)");
                }
              },

              // 탈퇴 → 훅의 deleteAccount 실행 후 로그인 화면으로
              onPressDeleteAccount: async () => {
                try {
                  await deleteAccount();
                  Alert.alert("탈퇴 완료", "회원 탈퇴가 완료되었습니다.");
                  router.replace("/(login)");
                } catch (e: any) {
                  Alert.alert(
                    "오류",
                    e?.response?.data?.message ??
                      e?.message ??
                      "회원 탈퇴 처리 중 오류가 발생했습니다."
                  );
                }
              },

              // 스위치 값/토글
              marketingAgree: !!profile?.agreeMarketing,
              onToggleMarketing: async (v) => {
                await setMarketingAgree(v);
              },
              marketingDisabled: changingMarketing,

              thirdPartyAgree: !!profile?.agree3rdParty,
              onToggleThirdParty: async (v) => {
                await setThirdPartyAgree(v);
              },
              thirdPartyDisabled: changingThird,
            }}
          />
        </View>
      </ScrollView>
      <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
  header: { paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "800", color: "#111827" },
  cardWrap: { paddingHorizontal: 16, marginTop: 16 },
  sectionsWrap: {
    paddingHorizontal: 0,
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#F3F4F6",
  },
});
