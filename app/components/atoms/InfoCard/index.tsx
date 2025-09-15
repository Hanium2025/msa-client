import React from "react";
import { View, Text } from "react-native";
import styles from "./InfoCard.style";

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function InfoCard({ title, description, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>📦 {title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}
