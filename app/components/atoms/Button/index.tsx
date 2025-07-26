import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Button.style";

interface ButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed?: boolean;
  text: string;
  variant?: "action" | "submit" | "signUpComplete" | "check";
  checked?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  onPressIn,
  onPressOut,
  isPressed = false,
  text,
  variant = "action",
  checked = false,
  disabled = false,
}) => {
  const getContainerStyle = () => {
    if (variant === "submit") {
      return [
        styles.baseButton,
        styles.submitButton,
        isPressed && styles.submitButtonPressed,
      ];
    }

    if (variant === "signUpComplete") {
      return [
        styles.signUpCompleteButton,
        disabled && styles.signUpCompleteButtonDisabled,
      ];
    }

    if (variant === "check") {
      return [styles.checkButton];
    }

    if (variant === "action") {
      return [styles.baseButton, styles.actionButton];
    }
  };

  const getTextStyle = () => {
    if (variant === "signUpComplete") return styles.signUpCompleteText;
    if (variant === "submit") return styles.submitText;
    if (variant === "check") return styles.checkText;
    if (variant === "action") return styles.actionText;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      {variant === "check" ? (
        <View style={styles.row}>
          <Ionicons
            name={checked ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color="#084C63"
            style={styles.checkIcon}
          />
          <Text style={getTextStyle()}>{text}</Text>
        </View>
      ) : (
        <Text style={getTextStyle()}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
