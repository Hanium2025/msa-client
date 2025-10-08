import React from "react";
import { Switch, Platform } from "react-native";
import ListRow from "../ListRow";
import type { ImageSourcePropType } from "react-native";

type Props = {
  title: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  subtitle?: string;
  iconSource?: ImageSourcePropType;
  IconComponent?: React.ReactNode;
  disabled?: boolean;
};

export default function SettingsToggleRow({
  title,
  value,
  onValueChange,
  subtitle,
  iconSource,
  IconComponent,
  disabled = false,
}: Props) {
  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      iconSource={iconSource}
      IconComponent={IconComponent}
      right={
        <Switch
          value={value}
          onValueChange={(v) => onValueChange?.(v)}
          disabled={!!disabled}
          trackColor={{ false: "#FFF", true: "#C1F209" }}
          thumbColor={Platform.OS === "android" ? "#FFF" : undefined}
          ios_backgroundColor="#FFF"
        />
      }
    />
  );
}
