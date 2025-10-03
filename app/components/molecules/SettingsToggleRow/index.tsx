// components/molecules/SettingsToggleRow.tsx
import React from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Platform,
  Image,
  ImageSourcePropType,
} from "react-native";

type Props = {
  title: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  subtitle?: string;
  iconSource?: ImageSourcePropType;
  disabled?: boolean;
};

export default function SettingsToggleRow({
  title,
  value,
  onValueChange,
  subtitle,
  iconSource,
  disabled = false,
}: Props) {
  return (
    <View style={s.row} /* 행 자체는 Pressable/Touchable 금지 */>
      <View style={s.left}>
        {iconSource ? <Image source={iconSource} style={s.icon} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {/* Switch만 터치 받도록 */}
      <View pointerEvents="box-none">
        <Switch
          value={value} // 부모 값만 사용 (완전 제어)
          onValueChange={(v) => onValueChange(v)} // 뒤집지 않기
          disabled={disabled}
          trackColor={{ false: "#E5E7EB", true: "#C1F209" }}
          thumbColor={Platform.OS === "android" ? "#FFF" : undefined}
          ios_backgroundColor="#E5E7EB"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFF",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, gap: 10 },
  icon: { width: 20, height: 20, marginRight: 10, resizeMode: "contain" },
  title: { fontSize: 16, color: "#111827" },
  subtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
