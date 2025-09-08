import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import styles from "./TransactionReviewDetailInput.style";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
};

export const TransactionReviewDetailInput: React.FC<Props> = ({
  value,
  onChange,
}) => {
  return (
    <View>
      <Text style={styles.label}>상세 평가하기</Text>
      <TextInput
        style={styles.input}
        value={value ?? ""}
        onChangeText={(t) => onChange?.(t)}
        multiline
        placeholder="여기에 평가를 자세히 적을 수 있어요."
        placeholderTextColor="#B9B4BB"
      />
    </View>
  );
};
