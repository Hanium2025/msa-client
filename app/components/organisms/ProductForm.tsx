import React from "react";
import { View, StyleSheet } from "react-native";
import RegisterLabel from "../atoms/Label";
import { Input } from "../atoms/Input";
import { PriceInput } from "../molecules/PriceInput";
import { CategoryDropdown } from "../molecules/CategoryDropdown";



type Props = {
  title: string;
  setTitle: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  category: CategoryValue | '선택';
  setCategory: React.Dispatch<React.SetStateAction<CategoryValue | '선택'>>;
  content: string;
  setContent: (v: string) => void;
};

export function ProductForm({
  title, setTitle,
  price, setPrice,
  category, setCategory,
  content, setContent,
}: Props) {
  return (
    <>
      <View style={styles.row}>
        <RegisterLabel required text="상품명" style={styles.label} />
        <Input placeholder="상품명을 입력하세요" value={title} onChangeText={setTitle} style={styles.flexInput} />
      </View>

      <View style={styles.row}>
        <RegisterLabel required text="가격" style={styles.label} />
        <PriceInput price={price} onChangePrice={setPrice} style={styles.flexInput} />
      </View>

      <View style={styles.row}>
        <RegisterLabel required text="카테고리" style={styles.label} />
        <CategoryDropdown selected={category} onSelect={setCategory} style={styles.flexInput} />
      </View>

      <View style={{ marginTop: 24 }}>
        <RegisterLabel text="상세설명" />
        <Input
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
          style={styles.textarea}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  label: { width: 80, marginRight: 8 },
  flexInput: { flex: 1 },
  textarea: {
    width: 345,
    height: 310,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
  },
});
