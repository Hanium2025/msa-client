import React from "react";
import { View } from "react-native";
import { styles } from "./RowWithButton.style";

interface RowWithButtonProps {
  input: React.ReactNode;
  button: React.ReactNode;
}

const RowWithButton: React.FC<RowWithButtonProps> = ({ input, button }) => {
  return (
    <View style={styles.wrapper}>
      {input}
      {button}
    </View>
  );
};

export default RowWithButton;
