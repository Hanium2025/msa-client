import React from "react";
import { Text, View, Pressable } from "react-native";
import styles from "./InfoRow.style";

type Props = {
  label: string;
  value: string;
  onPressValue?: () => void;
  alignRight?: boolean;
};

export default function InfoRow({ label, value, onPressValue, alignRight }: Props) {
  const valueStyle = [styles.value, alignRight && styles.valueRight];

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      {onPressValue ? (
        <Pressable onPress={onPressValue} hitSlop={8} style={{ flex: 1 }}>
          <Text style={[...valueStyle, styles.link]} numberOfLines={1}>
            {value}
          </Text>
        </Pressable>
      ) : (
        <Text style={valueStyle} numberOfLines={1}>
          {value}
        </Text>
      )}
    </View>
  );
}
