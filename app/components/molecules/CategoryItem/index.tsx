import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { styles } from './CategoryItem.style';

interface Category {
  id: string;
  name: string;
  iconSource: ImageSourcePropType; 
}

export default function CategoryItem({ item }: { item: Category }) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        router.push({
          pathname: '/(category)/[slug]', 
          params: { slug: item.id, title: item.name },
        })
      }
      activeOpacity={0.9}
    >
      <View style={styles.iconWrap}>
        <Image source={item.iconSource} style={styles.iconImage} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}
