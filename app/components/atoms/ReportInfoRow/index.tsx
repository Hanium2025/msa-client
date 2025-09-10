import React from "react";
import { View, Text, ViewStyle, StyleProp, TextStyle } from "react-native";
import { styles } from "./ReportInfoRow.style";

type Props = {
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  showDivider?: boolean;
};

export const ReportInfoRow: React.FC<Props> = ({
  label,
  value,
  style,
  valueStyle,
  showDivider = true,
}) => {
  return (
    <>
      <View style={[styles.row, style]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: "#084C63" }, valueStyle]}>
          {value}
        </Text>
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};
