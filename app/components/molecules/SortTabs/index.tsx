// SortTabs.tsx
import React, { useMemo } from "react";
import { View } from "react-native";
import { ChipTab } from "../../atoms/ChipTab";
import { styles } from "./SortTabs.style";

// 제네릭 T: string 리터럴 유니온
type SortOption<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  value: T;
  onChange: (k: T) => void;
  items?: SortOption<T>[];
  segmented?: boolean;
  width?: number;
};

export function SortTabs<T extends string = "new" | "old">({
  value,
  onChange,
  items,
  segmented = true,
  width = 370,
}: Props<T>) {
  const data = useMemo<SortOption<T>[]>(
    () =>
      items ??
      ([
        { key: "new", label: "최신 순" },
        { key: "old", label: "오래된 순" },
      ] as unknown as SortOption<T>[]), // 기본 옵션을 T로 캐스팅
    [items]
  );

  const Wrap = segmented ? View : View;
  const tabStyle = segmented ? styles.segmentTab : styles.rowTab;
  const wrapStyle = segmented ? [styles.segmentWrap, { width }] : [styles.row];

  return (
    <View style={wrapStyle}>
      {data.map((opt) => (
        <ChipTab
          key={String(opt.key)}
          label={opt.label}
          active={value === opt.key}
          onPress={() => onChange(opt.key)}
          style={tabStyle}
        />
      ))}
    </View>
  );
}
