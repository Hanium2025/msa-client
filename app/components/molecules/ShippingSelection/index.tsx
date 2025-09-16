import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import styles from "./ShippingSelection.style";

type Option = "existing" | "new";
type Props = {
  defaultValue?: Option;
  onSelect?: (value: Option) => void;
};

export default function ShippingSelection({
  defaultValue = "existing",
  onSelect,
}: Props) {
  const [selected, setSelected] = useState<Option>(defaultValue);

  const handleSelect = (value: Option) => {
    setSelected(value);
    onSelect?.(value);
  };

  const itemStyle = (isSelected: boolean) => [
    styles.selectionItemBase,
    isSelected ? styles.selectionItemBlue : styles.selectionItemGray,
  ];
  const textStyle = (isSelected: boolean) => [
    styles.textBase,
    isSelected ? styles.textBlue : styles.textGray,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>배송 정보</Text>
      <View style={styles.selectionContainer}>
        <Pressable
          onPress={() => handleSelect("existing")}
          style={() => [...itemStyle(selected === "existing")]}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === "existing" }}
        >
          <Text style={textStyle(selected === "existing")}>기존 배송지</Text>
        </Pressable>

        <Pressable
          onPress={() => handleSelect("new")}
          style={() => [...itemStyle(selected === "new")]}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === "new" }}
        >
          <Text style={textStyle(selected === "new")}>신규입력</Text>
        </Pressable>
      </View>
    </View>
  );
}
