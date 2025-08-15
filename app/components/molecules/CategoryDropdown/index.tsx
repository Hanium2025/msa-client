import React, { useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { styles } from "./CategoryDropdown.style";

interface CategoryDropdownProps {
  selected: string;                 // 서버에 보낼 value (예: "FOOD")
  onSelect: (categoryValue: string) => void;
  style?: StyleProp<ViewStyle>;     // 한 줄 레이아웃용 컨테이너 스타일
  placeholder?: string;             // 기본 "카테고리명"
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

const POPOVER_W = 240;
const POPOVER_MAX_H = 280;
const GAP = 6; // 버튼과 팝오버 간격

export const CategoryDropdown = ({
  selected,
  onSelect,
  style,
  placeholder = "카테고리명",
}: CategoryDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [boxLayout, setBoxLayout] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
 const iconRef = useRef<any>(null);

  const selectedLabel =
    categories.find((c) => c.value === selected)?.label || placeholder;

  const measureIcon = () => {
    // 아이콘 버튼의 화면 좌표 측정 → 팝오버 위치 계산에 사용
    const node = iconRef.current;
  if (node && typeof node.measureInWindow === "function") {
    node.measureInWindow((x: number, y: number, w: number, h: number) => {
      setBoxLayout({ x, y, w, h });
      setOpen(true);
    });
  } else {
    // 측정 실패해도 일단 열기(기본 위치로 뜸)
    setOpen(true);
  }
  };

  const handlePick = (v: string) => {
    onSelect(v);
    setOpen(false);
  };

  // 팝오버 위치 계산
  const { width: sw, height: sh } = Dimensions.get("window");
  let popLeft = 12;
  let popTop = 12;
  if (boxLayout) {
    // 버튼의 오른쪽에 맞춰 우측정렬(필드와 분리)
    popLeft = Math.min(
      Math.max(boxLayout.x + boxLayout.w - POPOVER_W, 12),
      sw - POPOVER_W - 12
    );
    popTop = Math.min(
      boxLayout.y + boxLayout.h + GAP,
      sh - POPOVER_MAX_H - 12
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* 선택 박스(텍스트만) + 우측 토글 버튼 */}
      <View style={styles.box}>
        <Text numberOfLines={1} style={styles.boxText}>
          {selectedLabel}
        </Text>

        <TouchableOpacity
          ref={iconRef}
          onPress={measureIcon}
          style={styles.iconBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.8}
        >
          <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
            <Image
              source={require("../../../../assets/images/arrow_drop_down.png")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* 분리된 팝업(Modal) */}
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* 바깥 클릭 닫기 */}
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        {/* 팝오버 패널 */}
        <View style={[styles.popover, { width: POPOVER_W, top: popTop, left: popLeft }]}>
          <ScrollView style={{ maxHeight: POPOVER_MAX_H }} bounces={false} showsVerticalScrollIndicator>
            {categories.map((item, idx) => (
              <TouchableOpacity
                key={item.value}
                style={[styles.item, idx === categories.length - 1 && styles.itemLast]}
                onPress={() => handlePick(item.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.itemText,
                    selected === item.value && styles.itemTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
