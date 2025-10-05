import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import SectionTitle from "../../components/atoms/Typography";
import AvatarEditor from "../../components/molecules/AvatarEditor";
import LabeledInputRow from "../../components/atoms/LabeledInputRow";
import ActionFooter from "../../components/molecules/ActionFooter";
import * as ImagePicker from 'expo-image-picker';

type Props = {
  defaultNickname?: string;
  defaultAvatarUri?: string;
  onBack?: () => void;
  onSubmit?: (payload: { nickname: string; newLocalAvatarUri?: string; isAvatarChanged: boolean }) => void;
  bottomPadding?: number; 
};

export default function ProfileEdit({
  defaultNickname = "",
  defaultAvatarUri,
  onBack,
  onSubmit,
  bottomPadding = 24, 
}: Props) {
  const [nickname, setNickname] = useState(defaultNickname);
  const [newLocalAvatarUri, setNewLocalAvatarUri] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>(defaultAvatarUri);

  const handlePickImage = async () => {
    // 1. 권한 요청
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("권한 필요", "앨범에 접근하려면 권한을 허용해야 합니다.");
      return;
    }

    // 2. 이미지 라이브러리 실행
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // 1:1 비율로 자르기
      quality: 0.8,   // 이미지 품질
    });

    // 3. 이미지 선택 완료 시
    if (!pickerResult.canceled) {
      setNewLocalAvatarUri(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    onSubmit?.({
      nickname,
      newLocalAvatarUri,
      isAvatarChanged: !!newLocalAvatarUri, // 새 이미지가 선택되었는지 여부
    });
  };
  const displayAvatar = newLocalAvatarUri || defaultAvatarUri;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <SectionTitle>프로필 수정하기</SectionTitle>

      <View style={{ height: 32 }} />

      <View style={{ alignItems: "center" }}>
        <AvatarEditor uri={displayAvatar} onPickImage={handlePickImage} />
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
