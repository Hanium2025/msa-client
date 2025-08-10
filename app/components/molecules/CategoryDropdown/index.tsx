import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./CategoryDropdown.style";

interface CategoryDropdownProps {
  selected: string; // 서버에 보낼 value (예: "FOOD")
  onSelect: (categoryValue: string) => void;
}

const categories = [
  { label: "IT, 전자제품", value: "ELECTRONICS" },
  { label: "가구, 인테리어", value: "FURNITURE" },
  { label: "옷, 잡화, 장신구", value: "CLOTHES" },
  { label: "도서, 학습 용품", value: "BOOK" },
  { label: "헤어, 뷰티, 화장품", value: "BEAUTY" },
  { label: "음식, 식료품", value: "FOOD" },
  { label: "기타", value: "ETC" },
];

export const CategoryDropdown = ({
  selected,
  onSelect,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedLabel =
    categories.find((cat) => cat.value === selected)?.label || "선택";

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownBox}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.list}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.item}
              onPress={() => handleSelect(item.value)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
