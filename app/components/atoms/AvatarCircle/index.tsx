import React, { useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
import styles from "./AvatarCircle.style";

const DEFAULT_AVATAR: ImageSourcePropType =
  require("../../../../assets/images/default-avatar.png");

type Props = {
  uri?: string;
  size?: number;
  /* 필요하면 다른 기본 이미지를 주입 가능 */
  placeholderSource?: ImageSourcePropType;
};

export default function AvatarCircle({
  uri,
  size = 220,
  placeholderSource = DEFAULT_AVATAR,
}: Props) {
  const [failed, setFailed] = useState(false);
  const circle = { width: size, height: size, borderRadius: size / 2 };

  // 폴백 조건: uri 없음 or 로딩 실패
  const showFallback = !uri || failed;

  return (
    <Image
      source={showFallback ? placeholderSource : { uri }}
      onError={() => setFailed(true)}
      resizeMode="cover"
      style={[styles.img, circle]}
      accessibilityLabel="프로필 이미지"
    />
  );
}
