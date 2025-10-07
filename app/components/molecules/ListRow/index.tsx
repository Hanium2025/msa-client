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
  iconSource?: ImageSourcePropType; // ✅ 선택적 (벡터와 병행)
  IconComponent?: React.ReactNode; // ✅ 추가: 벡터 아이콘
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
  IconComponent,
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
        {/*벡터 아이콘이 있으면 표시, 없으면 이미지 */}
        {IconComponent ? (
          <View style={{ marginRight: 12 }}>{IconComponent}</View>
        ) : iconSource ? (
          <Image source={iconSource} style={styles.icon} resizeMode="contain" />
        ) : null}

        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {/* 오른쪽 영역 (스위치나 화살표 등) */}
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
