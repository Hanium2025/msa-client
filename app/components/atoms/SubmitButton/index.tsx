import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./SubmitButton.style";

interface SubmitButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed: boolean;
  text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  onPressIn,
  onPressOut,
  isPressed,
  text,
}) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isPressed && styles.submitButtonPressed]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Text style={styles.submitText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
