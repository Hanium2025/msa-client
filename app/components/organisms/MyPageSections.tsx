import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SectionTitle } from "../atoms/MyPageSectionTitle";
import ListRow from "../molecules/ListRow";
import SettingsToggleRow from "../molecules/SettingsToggleRow";
import SectionBlock from "../molecules/SectionBlock";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type TradeMenuHandlers = {
  onPressSales: () => void;
  onPressPurchases: () => void;
  onPressFavorites: () => void;
};

type CommunityMenuHandlers = {
  onPressMyPosts: () => void;
  onPressMyComments: () => void;
  onPressMyLikes: () => void;
};

type AccountMenuHandlers = {
  onPressChangePassword: () => void;
  onPressEditProfile: () => void;
  onPressLogout: () => void;
  onPressDeleteAccount: () => void;

  /** 동의 토글(마이페이지 화면에서 내려줌) */
  marketingAgree: boolean;
  onToggleMarketing: (v: boolean) => void;
  marketingDisabled?: boolean;

  thirdPartyAgree: boolean;
  onToggleThirdParty: (v: boolean) => void;
  thirdPartyDisabled?: boolean;
};

type Props = {
  tradeHandlers: TradeMenuHandlers;
  communityHandlers: CommunityMenuHandlers;
  accountHandlers: AccountMenuHandlers;
};

export default function MyPageSections({
  tradeHandlers,
  communityHandlers,
  accountHandlers,
}: Props) {
  return (
    <View style={styles.container}>
      {/* 내 정보 수정 */}
      <SectionTitle title="내 정보 수정" />
      <SectionBlock>
        <ListRow
          title="비밀번호 변경"
          IconComponent={<MaterialIcons name="lock" size={22} />}
          onPress={accountHandlers.onPressChangePassword}
        />
        <ListRow
          title="활동 프로필 수정"
           IconComponent={<MaterialIcons name="edit" size={22} />}
          onPress={() => router.push("/(mypage)/edit")}
          showDivider={false}
        />
      </SectionBlock>

      {/* 내 거래활동 */}
      <SectionTitle title="내 거래활동" />
      <SectionBlock>
        <ListRow
          title="판매 내역"
          IconComponent={
            <MaterialCommunityIcons name="arrow-expand-up" size={22} />
          }
          onPress={tradeHandlers.onPressSales}
        />
        <ListRow
          title="구매 내역"
          IconComponent={
            <MaterialCommunityIcons name="arrow-collapse-down" size={22} />
          }
          onPress={tradeHandlers.onPressPurchases}
        />
        <ListRow
          title="관심 상품"
          IconComponent={<MaterialIcons name="star" size={22} />}
          onPress={tradeHandlers.onPressFavorites}
          showDivider={false}
        />
      </SectionBlock>

      {/* 내 (커뮤니티서비스의) 활동
      <SectionTitle title="내 (커뮤니티서비스의) 활동" />
      <SectionBlock>
        <ListRow
          title="작성 글"
          IconComponent={
            <MaterialCommunityIcons
              name="comment-text-multiple-outline"
              size={22}
            />
          }
          onPress={communityHandlers.onPressMyPosts}
        />
        <ListRow
          title="작성 댓글"
          IconComponent={<MaterialIcons name="mode-comment" size={22} />}
          onPress={communityHandlers.onPressMyComments}
        />
        <ListRow
          title="좋아요한 글"
          IconComponent={<AntDesign name="heart" size={22} />}
          onPress={communityHandlers.onPressMyLikes}
          showDivider={false}
        />
      </SectionBlock> */}

      {/* 계정 관리 */}
      <SectionTitle title="계정 관리" />

      <SectionBlock>
        {/* 마케팅 동의 */}
        <SettingsToggleRow
          title="마케팅 정보 수신 동의"
          IconComponent={<MaterialIcons name="notifications-none" size={22} />}
          value={accountHandlers.marketingAgree}
          onValueChange={accountHandlers.onToggleMarketing}
          disabled={accountHandlers.marketingDisabled}
        />

        {/* 제3자 동의 */}
        <SettingsToggleRow
          title="제 3자 정보 제공 동의"
          IconComponent={
            <MaterialCommunityIcons name="inbox-arrow-up-outline" size={22} />
          }
          value={accountHandlers.thirdPartyAgree}
          onValueChange={accountHandlers.onToggleThirdParty}
          disabled={accountHandlers.thirdPartyDisabled}
        />

        <ListRow
          title="로그아웃"
          IconComponent={<MaterialIcons name="logout" size={22} />}
          onPress={accountHandlers.onPressLogout}
        />
        <ListRow
          title="회원 탈퇴"
          IconComponent={<MaterialIcons name="person-remove-alt-1" size={22} />}
          onPress={accountHandlers.onPressDeleteAccount}
          showDivider={false}
        />
      </SectionBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
});
