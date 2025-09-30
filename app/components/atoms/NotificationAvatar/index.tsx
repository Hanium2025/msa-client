import React from "react";
import { Image, View, ImageSourcePropType } from "react-native";
import styles from "./NotificationAvatar.style";

type Props = {
  size?: number;
  source?: ImageSourcePropType;
};

export default function NotificationAvatar({ size = 40, source }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 5 }]}>
      {source ? (
        <Image source={source} style={[styles.img, { borderRadius: size / 5 }]} />
      ) : (
        <View style={[styles.placeholder, { borderRadius: size / 5 }]} />
      )}
    </View>
  );
}
