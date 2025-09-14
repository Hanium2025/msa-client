import React from "react";
import { Text } from "react-native";
import styles from "./Typography.style";

type Props = { children: React.ReactNode; style?: any };
export default function SectionTitle({ children, style }: Props) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}
