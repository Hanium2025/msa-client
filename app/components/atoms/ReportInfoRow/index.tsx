import React from "react";
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  StyleProp,
  TextStyle,
  KeyboardTypeOptions,
} from "react-native";
import { styles } from "./ReportInfoRow.style";

type Props = {
  label: string;
  value: string; // controlled value
  onChangeText: (t: string) => void; // state setter
  placeholder?: string;
  textColor?: string;
  placeholderColor?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  showDivider?: boolean;
  editable?: boolean;
};

export const ReportInfoRow: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  textColor = "#0846C3",
  placeholderColor = "#94A3B8",
  keyboardType = "default",
  maxLength,
  secureTextEntry,
  autoFocus,
  style,
  inputStyle,
  showDivider = true,
  editable = true,
}) => {
  return (
    <>
      <View style={[styles.row, style]}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          value={value}
          onChangeText={(t) => onChangeText?.(t)}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.input, { color: textColor }, inputStyle]}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};
