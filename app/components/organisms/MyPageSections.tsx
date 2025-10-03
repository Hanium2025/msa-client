import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SectionTitle } from "../atoms/MyPageSectionTitle";
import ListRow from "../molecules/ListRow";
import SettingsToggleRow from "../molecules/SettingsToggleRow";
import SectionBlock from "../molecules/SectionBlock";
import ConfirmModal from "../molecules/Modal";
import { router, useRouter } from "expo-router";

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
  onPressDeleteAccount: () => void; // 탈퇴 처리
  marketingAgree: boolean;
  onToggleMarketing: (v: boolean) => void | Promise<void>;
  marketingDisabled?: boolean;
  thirdPartyAgree: boolean;
  onToggleThirdParty: (v: boolean) => void | Promise<void>;
  thirdPartyDisabled?: boolean;
};

type Props = {
  tradeHandlers: {
    onPressSales: () => void;
    onPressPurchases: () => void;
    onPressFavorites: () => void;
  };
  communityHandlers: {
    onPressMyPosts: () => void;
    onPressMyComments: () => void;
    onPressMyLikes: () => void;
  };
  accountHandlers: AccountMenuHandlers;
};

export default function MyPageSections({
  tradeHandlers,
  communityHandlers,
  accountHandlers,
}: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* 내 정보 수정 */}
      <SectionTitle title="내 정보 수정" />
      <SectionBlock>
        <ListRow
          title="비밀번호 변경"
          iconSource={require("../../../assets/images/lock.png")}
          onPress={accountHandlers.onPressChangePassword}
        />
        <ListRow
          title="활동 프로필 수정"
          iconSource={require("../../../assets/images/edit.png")}
          onPress={() => router.push("/(mypage)/edit")}
          showDivider={false}
        />
      </SectionBlock>

      {/* 내 거래활동 */}
      <SectionTitle title="내 거래활동" />
      <SectionBlock>
        <ListRow
          title="판매 내역"
          iconSource={require("../../../assets/images/sell.png")}
          onPress={tradeHandlers.onPressSales}
        />
        <ListRow
          title="구매 내역"
          iconSource={require("../../../assets/images/purchase.png")}
          onPress={tradeHandlers.onPressPurchases}
        />
        <ListRow
          title="관심 상품"
          iconSource={require("../../../assets/images/interest.png")}
          onPress={() => router.push("/(favorites)")}
          showDivider={false}
        />
      </SectionBlock>

      {/* 내 (커뮤니티서비스의) 활동 */}
      <SectionTitle title="내 (커뮤니티서비스의) 활동" />
      <SectionBlock>
        <ListRow
          title="작성 글"
          iconSource={require("../../../assets/images/article.png")}
          onPress={communityHandlers.onPressMyPosts}
        />
        <ListRow
          title="작성 댓글"
          iconSource={require("../../../assets/images/comment.png")}
          onPress={communityHandlers.onPressMyComments}
        />
        <ListRow
          title="좋아요한 글"
          iconSource={require("../../../assets/images/like.png")}
          onPress={communityHandlers.onPressMyLikes}
          showDivider={false}
        />
      </SectionBlock>

      {/* 계정 관리 */}
      <SectionTitle title="계정 관리" />
      <SectionBlock>
        <SettingsToggleRow
          title="마케팅 정보 수신 동의"
          iconSource={require("../../../assets/images/notifications.png")}
          value={accountHandlers.marketingAgree}
          onValueChange={accountHandlers.onToggleMarketing}
          disabled={accountHandlers.marketingDisabled}
        />
        <SettingsToggleRow
          title="제 3자 정보 제공 동의"
          iconSource={require("../../../assets/images/outbox.png")}
          value={accountHandlers.thirdPartyAgree}
          onValueChange={accountHandlers.onToggleThirdParty}
          disabled={accountHandlers.thirdPartyDisabled}
        />
        <ListRow
          title="로그아웃"
          iconSource={require("../../../assets/images/logout.png")}
          onPress={() => router.push("/(login)")}
        />
        <ListRow
          title="회원 탈퇴"
          iconSource={require("../../../assets/images/signout.png")}
          onPress={() => setDeleteModalOpen(true)}
          showDivider={false}
        />
      </SectionBlock>
      <ConfirmModal
        visible={deleteModalOpen}
        title="정말 탈퇴하시겠습니까?"
        cancelText="취소"
        confirmText="탈퇴"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          accountHandlers.onPressDeleteAccount();
        }}
      />
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
