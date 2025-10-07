import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import BottomTabBar from "../components/molecules/BottomTabBar";
import ProfileCard from "../components/molecules/ProfileCard";
import OtherProfileContent from "../components/organisms/OtherProfileContent";

const PHONE_WIDTH = 390;
const BACK_ICON = require("../../assets/images/back.png");

export default function OtherProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<"notifications" | "chat" | "home" | "community" | "profile">("home");

  const profile = {
    name: "홍길동",
    mainCategories: ["IT, 전자제품", "도서, 학습 용품"],
    trustScore: 70,
    avatarSource: require("../../assets/images/default-avatar.png"),
  };
  const sales = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        title: "상품명 ABCDE",
        price: 99000,
        imageUrl: "",
      })),
    []
  );
  const posts = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: 100 + i,
        title: "게시글 제목 ABCDE",
        imageUrl: "",
      })),
    []
  );

  return (
    <View style={s.webRoot}>
      <SafeAreaView style={s.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[s.backBtn, Platform.OS === "web" && ({ cursor: "pointer" } as any)]}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Image source={BACK_ICON} style={s.backIcon} resizeMode="contain" />
          </Pressable>
          <View style={{ width: 24 }} />
        </View>

        <View style={s.cardWrap}>
          <ProfileCard
            name={profile.name}
            mainCategories={profile.mainCategories}
            trustScore={profile.trustScore}
            avatarSource={profile.avatarSource}
            onPressProfile={() => {}}
          />
        </View>

        <OtherProfileContent
          salesItems={sales}
          postItems={posts}
          onPressProduct={(id) =>
            router.push({ pathname: "/(addProduct)/detail", params: { productId: String(id) } })
          }
          onPressPost={(postId) =>
            router.push({ pathname: "/(community)/post-detail", params: { id: String(postId) } })
          }
        />

        <BottomTabBar activeTab={activeTab} onTabPress={(t) => setActiveTab(t as any)} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
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

  header: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  backBtn: { paddingVertical: 6, paddingRight: 6 },
  backIcon: { width: 16, height: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  cardWrap: { paddingHorizontal: 16, marginTop: 8 },
});
