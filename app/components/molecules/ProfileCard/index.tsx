/* - 상단 프로필 영역: 아바타 + 닉네임 + 주요 활동 카테고리 + 신뢰도 바
   - 마이페이지 상단에 노출되는 사용자 정보 카드
   - onPressProfile로 프로필 상세화면 이동 가능 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./ProfileCard.style";
import AvatarCircle from "../../atoms/AvatarCircle";
import ProgressBar from "../../atoms/ProgressBar";
import type { ImageSourcePropType } from "react-native";

type Props = {
  name: string;
  mainCategories: string[]; // 예: ["수면·안전", "놀이·교육"]
  trustScore: number; // 0~100
  onPressProfile?: () => void;
  // string(URL) | require(...) | { uri: string } 모두 허용
  avatarSource?: string | number | { uri: string };
};

export default function ProfileCard({
  name,
  mainCategories,
  trustScore,
  onPressProfile,
  avatarSource,
}: Props) {
  // AvatarCircle props로 변환
  let uri: string | undefined;
  let placeholderSource: ImageSourcePropType | undefined;

  if (typeof avatarSource === "string") {
    // "https://..." 같은 원격 URL
    uri = avatarSource;
  } else if (typeof avatarSource === "number") {
    // require("...") 결과 (로컬 자원)
    placeholderSource = avatarSource;
  } else if (
    avatarSource &&
    typeof avatarSource === "object" &&
    "uri" in avatarSource
  ) {
    uri = avatarSource.uri;
  }

  return (
    <Pressable
      onPress={onPressProfile}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <AvatarCircle
          size={56}
          uri={uri}
          // 지정이 없으면 AvatarCircle 내부 DEFAULT_AVATAR 사용
          {...(placeholderSource ? { placeholderSource } : {})}
        />
      </View>

      <View style={styles.right}>
        <Text style={styles.name}>{name} 님</Text>

        <View style={styles.catRow}>
          <Text style={styles.catLabel}>주요 활동 카테고리</Text>
          <Text style={styles.catValue}>{mainCategories.join(" · ")}</Text>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustBar}>
            <ProgressBar value={trustScore} max={100} />
          </View>
          <Text style={styles.trustLabel}>신뢰도</Text>

          <View style={styles.scoreBoard}>
            <Text style={styles.trustScore}>{trustScore}</Text>
            <Text style={styles.scoreText}>점</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
