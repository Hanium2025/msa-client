import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import ProfileCard from "../components/molecules/ProfileCard";
import MyPageSections from "../components/organisms/MyPageSections";

const PHONE_WIDTH = 390;

export default function MyPageScreen() {
  // 실제 데이터는 API로 교체
  const [marketingAgree, setMarketingAgree] = useState(true);
  const [thirdAgree, setThirdAgree] = useState(true);

  const handlers = {
    trade: {
      onPressSales: () => {},
      onPressPurchases: () => {},
      onPressFavorites: () => {},
    },
    community: {
      onPressMyPosts: () => {},
      onPressMyComments: () => {},
      onPressMyLikes: () => {},
    },
    account: {
      onPressChangePassword: () => {},
      onPressEditProfile: () => {},
      onPressLogout: () => {},
      onPressDeleteAccount: () => {},
      marketingAgree,
      onToggleMarketing: setMarketingAgree,
      thirdPartyAgree: thirdAgree,
      onToggleThirdParty: setThirdAgree,
    },
  };

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
            name="홍길동"
            mainCategories={["수면·안전", "놀이·교육"]}
            trustScore={70}
            avatarSource={require("../../assets/images/default-avatar.png")}
            onPressProfile={() => {}}
          />
        </View>

        <View style={s.sectionsWrap}>
          <MyPageSections
            tradeHandlers={handlers.trade}
            communityHandlers={handlers.community}
            accountHandlers={handlers.account}
          />
        </View>
      </ScrollView>
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
