// components/organisms/AddProductForm.tsx
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import RegisterLabel from '../atoms/Label';
import Button from '../atoms/Button';
import { Input } from '../atoms/Input';
import { CategoryDropdown } from '../molecules/CategoryDropdown';
import { ImageUploader } from '../molecules/ImageUploader';
import { PriceInput } from '../molecules/PriceInput';

export type AddProductFormValues = {
  title: string;
  price: string;          // 표시용 문자열
  content: string;
  category: string;       // enum value 혹은 '선택'
  images: any[];          // web: File[], native: { uri, name?, type? }[]
};

type Props = {
  values: AddProductFormValues;
  onChange: (patch: Partial<AddProductFormValues>) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

// 재사용 가능한 한 줄 필드 래퍼 (UI 전용)
const FieldRow = ({
  label,
  required,
  children,
  style,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  style?: any;
}) => (
  <View style={[styles.row, style]}>
    <RegisterLabel required={required} text={label} style={styles.rowLabel} />
    <View style={styles.rowControl}>{children}</View>
  </View>
);

const AddProductForm: React.FC<Props> = ({ values, onChange, onSubmit, submitting }) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formWrapper}>
        <RegisterLabel required text="대표사진" />
        <ImageUploader
          images={values.images}
          setImages={(imgs: any[]) => onChange({ images: imgs })}
        />

        <FieldRow label="상품명" required style={{ marginTop: 20 }}>
          <Input
            placeholder="Value"
            value={values.title}
            onChangeText={(t) => onChange({ title: t })}
            style={styles.input}
          />
        </FieldRow>

        <FieldRow label="가격" required style={{ marginTop: 14 }}>
          <PriceInput
            price={values.price}
            onChangePrice={(p) => onChange({ price: p })}
            style={styles.input}
          />
        </FieldRow>

        <FieldRow label="카테고리" required style={{ marginTop: 14 }}>
          <CategoryDropdown
            selected={values.category}
            onSelect={(c) => onChange({ category: c })}
            style={{ height: 44 }}
          />
        </FieldRow>

<View style={{ marginTop: 18 }}>
  <RegisterLabel text="상세설명" />
  <Input
    value={values.content}
    onChangeText={(t) => onChange({ content: t })}
    multiline
    numberOfLines={5}
    style={[
      styles.textarea, // 새 스타일 적용
    ]}
  />
</View>

        <View style={{ marginVertical: 16 }}>
          <Button
            text={submitting ? '등록 중...' : '등록하기'}
            variant="signUpComplete"
            onPress={onSubmit}
            disabled={!!submitting}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  formWrapper: { width: '100%', maxWidth: 393 },

  // 한 줄 레이아웃
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    borderBottomWidth: 1,        // 밑줄 추가
    borderBottomColor: '#ddd',   // 회색
    paddingBottom: 3,            // 라인과 텍스트 간격
  },
  rowLabel: { width: 84 },
  rowControl: { flex: 1 },

  // 오른쪽 컨트롤 공통 스타일
  input: { height: 44, width: '100%' },

  textarea: {
    width: 345,
    height: 310,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top', // 안드로이드에서 위쪽 정렬
  },
});
