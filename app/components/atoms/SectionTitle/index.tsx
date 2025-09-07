// components/atoms/SectionTitle.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
  onPressRight?: () => void;         
  showRightChevron?: boolean;        
  rightA11yLabel?: string;           
}

export const SectionTitle = ({
  title,
  subtitle,
  onPressRight,
  showRightChevron = true,
  rightA11yLabel = "전체 보기로 이동",
}: Props) => (
  <View style={styles.container}>
    {/* 왼쪽: 제목 + 서브타이틀 */}
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    {/* 오른쪽: 화살표 버튼 */}
    {showRightChevron ? (
      <Pressable
        onPress={onPressRight}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={rightA11yLabel}
        style={styles.rightBtn}
      >
        <Image
          source={require('../../../../assets/images/chevron-right.png')}
          style={styles.arrow}
          resizeMode="contain"
        />
      </Pressable>
    ) : null}
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
    flex: 1,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  subtitle: { fontSize: 17, color: '#999' },
  rightBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  arrow: { width: 16, height: 16 },
});
