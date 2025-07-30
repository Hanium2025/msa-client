import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './CategoryDropdown.style';

interface CategoryDropdownProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  '식품/건강',
  'IT/가전',
  '화장/유아',
  '패션잡화',
  '생활용품',
  '도서/문구',
];

export const CategoryDropdown = ({ selected, onSelect }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: string) => {
    onSelect(category);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        <Text style={styles.required}>* </Text>
        카테고리
      </Text>

      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>{selected}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.list}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
