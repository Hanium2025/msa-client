import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import SectionTitle from "../../components/atoms/Typography";
import AvatarEditor from "../../components/molecules/AvatarEditor";
import LabeledInputRow from "../../components/atoms/LabeledInputRow";
import ActionFooter from "../../components/molecules/ActionFooter";

type Props = {
  defaultNickname?: string;
  defaultAvatarUri?: string;
  onBack?: () => void;
  onSubmit?: (payload: { nickname: string; avatarUri?: string }) => void;
  bottomPadding?: number; 
};

export default function ProfileEdit({
  defaultNickname = "홍길동",
  defaultAvatarUri,
  onBack,
  onSubmit,
  bottomPadding = 24, 
}: Props) {
  const [nickname, setNickname] = useState(defaultNickname);
  const [avatar, setAvatar] = useState<string | undefined>(defaultAvatarUri);

  const handlePickImage = async () => {
    // TODO: 이미지 피커 연결 (expo-image-picker 등)
    // setAvatar(result.uri);
  };

  const handleSubmit = () => onSubmit?.({ nickname, avatarUri: avatar });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },   // 실제로 사용
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle>프로필 수정하기</SectionTitle>

      <View style={{ height: 32 }} />

      <View style={{ alignItems: "center" }}>
        <AvatarEditor uri={avatar} onPickImage={handlePickImage} />
      </View>

      <View style={{ height: 40 }} />

      <LabeledInputRow
        label="닉네임"
        value={nickname}
        onChangeText={setNickname}
        placeholder="닉네임을 입력해주세요."
      />

      <ActionFooter onLeft={onBack} onRight={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: 360,
    alignSelf: "center",
    paddingTop: 24,
    paddingBottom: 24,
  },
});
