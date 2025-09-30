import React from "react";
import { Text } from "react-native";
import styles from "./TimeText.style";

export default function TimeText({ value }: { value: string }) {
  return <Text style={styles.time}>{value}</Text>;
}
