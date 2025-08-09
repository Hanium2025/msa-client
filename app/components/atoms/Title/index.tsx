import React from "react";
import { Text } from "react-native";
import { styles } from "./Title.style";

export default function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}
