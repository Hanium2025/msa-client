import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  label: string;
}

export default function Tag({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,               // 테두리 두께
    borderColor: '#D1D1D1',       // 연한 회색 (원하는 색상으로 조정 가능)
  },
  text: {
    fontSize: 12,
    color: '#000',
  },
});
