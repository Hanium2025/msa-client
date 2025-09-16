import React from "react";
import { View, Text } from "react-native";
import styles from "./FormRow.style";

type Props = {
  label: string;
  right?: React.ReactNode;
  children?: React.ReactNode; 
};

export default function FormRow({ label, children, right }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.middle}>{children}</View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}
