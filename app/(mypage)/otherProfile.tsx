import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomTabBar from "../components/molecules/BottomTabBar";
import ProfileCard from "../components/molecules/ProfileCard";
import OtherProfileContent from "../components/organisms/OtherProfileContent";
import { useOtherProfile } from "../hooks/useOtherProfile";
import { tokenStore } from "../auth/tokenStore";

const PHONE_WIDTH = 390;
const BACK_ICON = require("../../assets/images/back.png");

// 토큰에서 내 memberId 파싱
function getUserIdFromToken(token: string): number | null {
  try {
    const body = token.split(".")[1];
    if (!body) return null;
    const bin =
      typeof atob === "function"
        ? atob(body.replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(
            body.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString("binary");
    const json = decodeURIComponent(
      Array.from(bin)
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    const payload = JSON.parse(json);
    const raw = payload.memberId ?? payload.userId ?? payload.id ?? payload.sub;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export default function OtherProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId?: string | string[] }>();
  const memberId = Number(Array.isArray(userId) ? userId[0] : userId);

  const [activeTab, setActiveTab] = useState<
    "notifications" | "chat" | "home" | "community" | "profile"
  >("home");

  const [token, setToken] = React.useState<string | null>(null);
  const [myId, setMyId] = React.useState<number | null>(null);
  const [tokenReady, setTokenReady] = React.useState(false);

  // 토큰 로드
  React.useEffect(() => {
    (async () => {
      const t = await tokenStore.get();
      if (!t) {
        Alert.alert("로그인이 필요합니다.");
        router.replace("/(login)");
        return;
      }
      setToken(t);
      setMyId(getUserIdFromToken(t));
      setTokenReady(true);
    })();
  }, [router]);

  // 내 프로필이면 마이페이지로 이동
  React.useEffect(() => {
    if (!tokenReady) return;
    if (myId != null && Number.isFinite(memberId) && myId === memberId) {
      Alert.alert("안내", "내 프로필은 상대 프로필로 이동할 수 없어요.");
      router.replace("/(mypage)");
    }
  }, [tokenReady, myId, memberId, router]);

  // 내 프로필 아님 + 쿼리 준비되어 있을 때
  const canQuery =
    tokenReady && !!token && Number.isFinite(memberId) && myId !== memberId;

  // 상대프로필 조회 훅
  const { data, isLoading, error } = useOtherProfile(
    canQuery ? memberId : undefined,
    canQuery ? token : undefined
  );

  if (!canQuery || isLoading) {
    return (
      <View style={s.webRoot}>
        <SafeAreaView style={s.phoneFrame}>
          <View style={s.center}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // 서버에서 400 등을 반환한 경우 후처리 (여기는 내 프로필 진입은 이미 막았지만 방어차원)
  if (error) {
    const msg = (error as any)?.message ?? "프로필을 불러오지 못했습니다.";
    if ((error as any)?.status === 400) {
      Alert.alert("안내", msg);
      router.replace("/(mypage)");
      return null;
    }
    return (
      <View style={s.webRoot}>
        <SafeAreaView style={s.phoneFrame}>
          <View style={s.center}>
            <Text style={{ color: "red" }}>{msg}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const profile = data!;
  const sales = profile.products ?? [];

  return (
    <View style={s.webRoot}>
      <SafeAreaView style={s.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        {/* 헤더 */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[
              s.backBtn,
              Platform.OS === "web" && ({ cursor: "pointer" } as any),
            ]}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Image source={BACK_ICON} style={s.backIcon} resizeMode="contain" />
          </Pressable>
          <Text style={s.headerTitle}>프로필 보기</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 상단 프로필 카드 */}
        <View style={s.cardWrap}>
          <ProfileCard
            name={profile.nickname}
            mainCategories={profile.mainCategory ?? []}
            trustScore={profile.score ?? 0}
            avatarSource={profile.imageUrl}
          />
        </View>

        {/* 판매 상품 / 게시글 목록 */}
        <OtherProfileContent
          salesItems={sales.map((item) => ({
            id: item.productId,
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl ?? "",
          }))}
          postItems={[]}
          onPressProduct={(id) =>
            router.push(`/(addProduct)/detail/${String(id)}`)
          }
          onPressPost={(postId) =>
            router.push(`/(community)/post-detail/${String(postId)}`)
          }
        />

        <BottomTabBar
          activeTab={activeTab}
          onTabPress={(t) => setActiveTab(t as any)}
        />
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
