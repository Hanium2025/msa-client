// components/atoms/SectionTitle.tsx
import React from "react";
import { View, Text } from "react-native";
import styles from "./MyPageSectionTitle.style";

interface Props {
  title: string;
  subtitle?: string;
  onPressRight?: () => void;
  showRightChevron?: boolean;
  rightA11yLabel?: string;
}

export const SectionTitle = ({ title, subtitle, onPressRight }: Props) => (
  <View style={styles.container}>
    {/* 왼쪽: 제목 + 서브타이틀 */}
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const PHONE_W = 390;
