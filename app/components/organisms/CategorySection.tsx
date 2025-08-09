import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { CategoryCircle } from '../atoms/CategoryCircle';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  categories: { id: string; name: string }[];
}

const CategorySection = ({ categories }: Props) => (
  <View>
    <SectionTitle title="카테고리별 보기" subtitle="최근 본 카테고리에요" />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <View style={styles.innerRow}>
        {categories.map((c) => (
          <CategoryCircle key={c.id} name={c.name} />
        ))}
      </View>
    </ScrollView>

  </View>
);


const styles = StyleSheet.create({
  row: {
    width: SCREEN_WIDTH, // ✅ 스크롤뷰 가로 사이즈를 고정
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'center', // ✅ 실제 카테고리 정렬
    alignItems: 'center',
  },
});


export default CategorySection;
