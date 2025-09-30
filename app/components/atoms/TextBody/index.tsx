import React, { ReactNode } from "react";
import { Text, TextProps } from "react-native";
import styles from "./TextBody.style";

export default function TextBody({ children, style, ...rest }: TextProps & { children: ReactNode }) {
  return (
    <Text style={[styles.body, style]} {...rest}>
      {children}
    </Text>
  );
}
