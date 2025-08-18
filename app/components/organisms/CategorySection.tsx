import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { CategoryCircle } from '../atoms/CategoryCircle';

interface Props {
  // ← 아이콘 추가
  categories: { id: string; name: string; icon: ImageSourcePropType }[];
}

const PHONE_W = 390;
const H_PAD = 16;
const ITEM = 72;
const GAP = (PHONE_W - H_PAD * 2 - ITEM * 4) / 3;

const CategorySection = ({ categories }: Props) => {
  const items = categories.slice(0, 4);
  return (
    <View style={{ width: PHONE_W, alignSelf: 'center' }}>
      <SectionTitle title="카테고리별 보기" subtitle="최근 본 카테고리에요" />
      <View style={[styles.innerRow, { paddingHorizontal: H_PAD }]}>
        {items.map((c, i) => (
          <View key={c.id} style={[styles.categoryItem, { marginRight: i === 3 ? 0 : GAP }]}>
            <CategoryCircle name={c.name} icon={c.icon} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerRow: { flexDirection: 'row', alignItems: 'center' },
  categoryItem: { width: ITEM, alignItems: 'center' },
});

export default CategorySection;
