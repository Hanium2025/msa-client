import React from "react";
import { View } from "react-native";
import { styles } from "./RowLabelWithInput.style";

interface RowLabelWithInputProps {
  label: React.ReactNode;
  input: React.ReactNode;
}

const RowLabelWithInput: React.FC<RowLabelWithInputProps> = ({
  label,
  input,
}) => {
  return (
    <View style={styles.wrapper}>
      {label}
      {input}
    </View>
  );
};

export default RowLabelWithInput;
