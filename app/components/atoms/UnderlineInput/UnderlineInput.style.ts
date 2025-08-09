import { StyleSheet, TextInputProps, TextStyle } from "react-native";

export interface UnderlineInputProps extends TextInputProps {
  style?: TextStyle;
}

export const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    paddingVertical: 8,
    flex: 1,
  },
});
