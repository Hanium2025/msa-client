// ProgressBar.tsx
import React from "react";
import { View } from "react-native";
import styles from "./ProgressBar.style";

type Props = { value: number; max?: number };

export default function ProgressBar({ value, max = 100 }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}
