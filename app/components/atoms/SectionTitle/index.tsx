import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: Props) => (
  <View style={styles.container}>
    {/* 왼쪽: 제목 + 서브타이틀 */}
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    {/* 오른쪽: 화살표 이미지 */}
    <Image
      source={require('../../../../assets/images/chevron-right.png')}
      style={styles.arrow}
      resizeMode="contain"
    />
  </View>
);

const PHONE_W = 390;

const styles = StyleSheet.create({
  container: {
    width: PHONE_W,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // 오른쪽으로 화살표 밀기
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#999',
  },
  arrow: {
    width: 16,
    height: 16,
  },
});
