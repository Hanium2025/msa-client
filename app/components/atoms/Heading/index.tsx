import React from "react";
import { Text, TextProps } from "react-native";
import styles from "./Heading.style";

type Props = TextProps & { children: React.ReactNode };

export default function Heading({ children, style, ...rest }: Props) {
  return (
    <Text style={[styles.heading, style]} {...rest}>
      {children}
    </Text>
  );
}
