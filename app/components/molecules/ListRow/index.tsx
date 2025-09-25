import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import styles from "./ListRow.style";

type Props = {
  title: string;
  subtitle?: string;
  iconSource: ImageSourcePropType;
  onPress?: () => void;
  right?: React.ReactNode;
  showRightChevron?: boolean;
  rightA11yLabel?: string;
  showDivider?: boolean;
};

export default function ListRow({
  title,
  subtitle,
  iconSource,
  onPress,
  right,
  showRightChevron = true,
  rightA11yLabel = "이 항목으로 이동",
  showDivider = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        showDivider ? styles.divider : null,
      ]}
    >
      <View style={styles.left}>
        <Image source={iconSource} style={styles.icon} resizeMode="contain" />

        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {right ? (
        <View style={styles.right}>{right}</View>
      ) : showRightChevron ? (
        <Pressable
          onPress={onPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={rightA11yLabel}
          style={styles.rightBtn}
        >
          <Image
            source={require("../../../../assets/images/chevron-right.png")}
            style={styles.arrow}
            resizeMode="contain"
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
