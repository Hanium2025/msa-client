// components/organisms/CategorySection.tsx
import React from 'react';
import { View, StyleSheet, Text, Pressable, ImageSourcePropType } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { CategoryCircle } from '../atoms/CategoryCircle';
import { CATEGORIES } from '../../constants/categories';     
import { RECENT_ICONS } from '../../../assets/recentCategoryIcons'; 

type SectionItem = {
  id: string;
  name: string;  
  slug?: string; 
};

interface Props {
  categories: SectionItem[];
  loading?: boolean;
  onPressCategory?: (slug: string, name: string) => void;
  onPressHeaderRight?: () => void;
}

const PHONE_W = 390;
const H_PAD = 16;
const ITEM = 72;
const GAP = (PHONE_W - H_PAD * 2 - ITEM * 4) / 3;

const ICON_BY_SLUG: Record<string, ImageSourcePropType> =
  Object.fromEntries(CATEGORIES.map(c => [c.slug, c.icon])) as any;
const TITLE_TO_SLUG: Record<string, string> =
  Object.fromEntries(CATEGORIES.map(c => [c.title, c.slug])) as any;

const DEFAULT_ICON = require('../../../assets/images/_etc.png');

function resolveIcon(name: string, slug?: string) {
  const key = slug ?? TITLE_TO_SLUG[name];    
  return (
    (key && RECENT_ICONS[key]) ||              
    (key && ICON_BY_SLUG[key]) ||              
    DEFAULT_ICON                                
  );
}

const CategorySection = ({ categories, loading, onPressCategory, onPressHeaderRight }: Props) => {
  const items = categories.slice(0, 4);
  const padded = [...items, ...Array(Math.max(0, 4 - items.length)).fill(null)].slice(0, 4);

  return (
    <View style={{ width: PHONE_W, alignSelf: 'center' }}>
      <SectionTitle
  title="카테고리별 보기"
  subtitle="최근 본 카테고리에요"
  onPressRight={onPressHeaderRight}
  showRightChevron
/>
      <View style={[styles.innerRow, { paddingHorizontal: H_PAD }]}>
        {padded.map((c, i) => {
          const marginRight = i === 3 ? 0 : GAP;

          if (loading || !c) {
            return (
              <View key={`ph-${i}`} style={[styles.categoryItem, { marginRight }]}>
                <View style={styles.placeholderCircle} />
                <Text style={styles.placeholderLabel}>{' '}</Text>
              </View>
            );
          }

          const slug = c.slug ?? TITLE_TO_SLUG[c.name] ?? 'OTHER';
          const icon = resolveIcon(c.name, slug);
          return (
            <Pressable
              key={c.id}
              style={[styles.categoryItem, { marginRight }]}
              onPress={() => { if (onPressCategory) onPressCategory(slug, c.name); }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`${c.name} 카테고리로 이동`}
            >
              <CategoryCircle name={c.name} icon={icon} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerRow: { flexDirection: 'row', alignItems: 'center' },
  categoryItem: { width: ITEM, alignItems: 'center' },
  placeholderCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E7EB', marginBottom: 6,
  },
  placeholderLabel: { fontSize: 12, color: '#9CA3AF' },
});

export default CategorySection;
