import React from "react";
import { Switch, ImageSourcePropType, Platform } from "react-native";
import ListRow from "../ListRow";

type Props = {
  title: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  subtitle?: string;
  iconSource: ImageSourcePropType;
};

export default function SettingsToggleRow({
  title,
  value,
  onValueChange,
  subtitle,
  iconSource,
}: Props) {
  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      iconSource={iconSource}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#FFF", true: "#C1F209" }}
          thumbColor={Platform.OS === "android" ? "#FFF" : undefined}
          ios_backgroundColor="#FFF"
        />
      }
    />
  );
}
