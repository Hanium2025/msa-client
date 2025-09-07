import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface Props {
  name: string;
  icon?: ImageSourcePropType; // 선택: 없으면 회색 배경만 표시
}

export const CategoryCircle = ({ name, icon }: Props) => (
  <View style={styles.container}>
    <View style={styles.circle}>
      {icon ? <Image source={icon} style={styles.icon} resizeMode="contain" /> : null}
    </View>
    <Text style={styles.text} numberOfLines={1}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 10,
  },
  circle: {          // 지름의 절반 (정확한 원)
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',          // 이미지가 원으로 잘리게
  },
  text: {
    fontSize: 12,
    color: '#666',
  },
});
