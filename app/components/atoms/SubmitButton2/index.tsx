import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./SubmitButton2.style";

interface SubmitButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed: boolean;
  text: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  onPressIn,
  onPressOut,
  isPressed,
  text,
  disabled = false,
}) => {
  const backgroundStyle = [
    styles.button,
    disabled ? styles.disabledButton : styles.activeButton,
  ];

  return (
    <TouchableOpacity
      style={backgroundStyle}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
