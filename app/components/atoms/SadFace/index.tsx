import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import styles from "./SadFace.style";

type Props = {
  size?: number;
  source?: ImageSourcePropType; 
  accessibilityLabel?: string;
};

const DEFAULT_SRC = require("../../../../assets/images/sad-face.png");

export default function SadFace({
  source = DEFAULT_SRC,
  accessibilityLabel = "슬픈 이모지",
}: Props) {
  return (
    <Image
      source={source}
      style={[styles.image]}
      resizeMode="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
