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
  label: string; // 왼쪽 라벨
  value: string; // 입력 값 (controlled)
  onChangeText: (t: string) => void; // 값 변경
  placeholder?: string; // 플레이스홀더
  textColor?: string; // 입력 텍스트 색
  placeholderColor?: string; // 플레이스홀더 색
  keyboardType?: KeyboardTypeOptions; // "phone-pad" 등
  maxLength?: number;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>; // 행 컨테이너
  inputStyle?: StyleProp<TextStyle>; // TextInput 추가 스타일
  showDivider?: boolean; // 하단 구분선
};

export const InfoRow: React.FC<Props> = ({
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
}) => {
  return (
    <>
      <View style={[styles.row, style]}>
        <Text style={styles.label}>{label}</Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          autoFocus={autoFocus}
          style={[styles.input, inputStyle, { color: textColor }]}
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );
};
