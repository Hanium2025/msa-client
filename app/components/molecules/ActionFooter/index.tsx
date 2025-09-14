// components/molecules/ActionFooter/ActionFooter.tsx
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../atoms/Button";
import styles from "./ActionFooter.style";

type Props = {
  leftText?: string;
  rightText?: string;
  onLeft?: () => void;
  onRight?: () => void;
  rightDisabled?: boolean;
};

export default function ActionFooter({
  leftText = "이전",
  rightText = "수정 완료",
  onLeft,
  onRight,
  rightDisabled,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: (insets?.bottom ?? 0) + 8 }]}>
      <Button
        variant="profileOutline"
        text={leftText}
        onPress={() => onLeft?.()}      
        style={styles.left}
      />
      <Button
        variant="profilePrimary"
        text={rightText}
        onPress={() => onRight?.()}     
        disabled={rightDisabled}
        style={styles.right}
      />
    </View>
  );
}
