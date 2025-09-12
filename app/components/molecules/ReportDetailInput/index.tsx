import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import styles from "./ReportDetailInput.style";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export const ReportDetailInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View>
      <Text style={styles.label}>상세 내용</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="신고 사유를 입력해주세요."
        placeholderTextColor="#B9B4BB"
      />
    </View>
  );
};
