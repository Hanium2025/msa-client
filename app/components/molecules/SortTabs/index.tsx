import React, { useMemo } from "react";
import { View } from "react-native";
import { ChipTab } from "../../atoms/ChipTab";
import { styles } from "./SortTabs.style";

export type SortKey = "new" | "old" | "popular" | string;

type SortOption = { key: SortKey; label: string };

type Props = {
  value: SortKey;
  onChange: (k: SortKey) => void;
  items?: SortOption[];     // 커스텀 정렬 옵션 (미지정 시 최신/오래된)
  segmented?: boolean;      // 세그먼트(배경 상자)로 감쌀지 여부
  width?: number;           // 웹에서 고정 폭(예: 370)
};

export function SortTabs({
  value,
  onChange,
  items,
  segmented = true,
  width = 370,
}: Props) {
  const data = useMemo<SortOption[]>(
    () =>
      items ?? [
        { key: "new", label: "최신 순" },
        { key: "old", label: "오래된 순" },
      ],
    [items]
  );

  if (segmented) {
    return (
      <View style={[styles.segmentWrap, { width }]}>
        {data.map((opt, idx) => (
          <ChipTab
            key={String(opt.key)}
            label={opt.label}
            active={value === opt.key}
            onPress={() => onChange(opt.key)}
            style={styles.segmentTab}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {data.map((opt) => (
        <ChipTab
          key={String(opt.key)}
          label={opt.label}
          active={value === opt.key}
          onPress={() => onChange(opt.key)}
          style={styles.rowTab}
        />
      ))}
    </View>
  );
}
