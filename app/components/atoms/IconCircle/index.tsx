import React from "react";
import { Pressable, View, Image, ImageSourcePropType } from "react-native";
import styles from "./IconCircle.style";

type Props = {
  onPress?: () => void;
  source: ImageSourcePropType; 
  bg?: string;
  accessibilityLabel?: string;
};

export default function IconCircle({
  onPress,
  source,
  bg = "rgba(255, 30, 0, 0.60)",
  accessibilityLabel = "button",
}: Props) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <View
        style={[
          styles.btn,
          {
            width: 75,
            height: 66,
            borderRadius: 24,
            backgroundColor: bg,
          },
        ]}
      >
        <Image
          source={source}
          style={{
            resizeMode: "contain",
          }}
        />
      </View>
    </Pressable>
  );
}
