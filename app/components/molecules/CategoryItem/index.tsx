import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './CategoryItem.style';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function CategoryItem({ item }: { item: Category }) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => router.push(`/category/${item.id}`)}>
      <View style={styles.icon}>
        <Ionicons name={item.icon} size={24} color="#666" />
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
}
