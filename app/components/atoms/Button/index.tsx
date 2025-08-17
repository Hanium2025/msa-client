// Button.tsx
import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./Button.style";

interface ButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed?: boolean;
  text: string;
  variant?:
  | "action"
  | "submit"
  | "signUpComplete"
  | "check"
  | "login"
  | "socialLogin"
  | "registerItem";
  checked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
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
  icon,
  backgroundColor,
  textColor,
}) => {
  const handlePress = async () => {
    if (onPress) await onPress();
  };

  // registerItem

  if (variant === "registerItem") {
    return (
      <View style={styles.registerWrapper}>
        <LinearGradient
          colors={["#023047", "#C1F209"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.registerGradientBorder}
        >
          <TouchableOpacity
            style={styles.registerItem}
            onPress={handlePress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
          >
            <Image
              source={require("../../../../assets/images/add-circle.png")} // ← 여기 경로 확인
              style={styles.registerImage}
              resizeMode="contain"
            />
            <Text style={styles.registerText}>{text}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }


  const getContainerStyle = () => {
    switch (variant) {
      case "submit":
        return [
          styles.baseButton,
          styles.submitButton,
          isPressed && styles.submitButtonPressed,
        ];
      case "signUpComplete":
        return [
          styles.signUpCompleteButton,
          disabled && styles.signUpCompleteButtonDisabled,
        ];
      case "check":
        return [styles.checkButton];
      case "login":
        return [styles.loginButton, isPressed && styles.loginButtonPressed];
      case "socialLogin":
        return [
          styles.socialButton,
          { backgroundColor: backgroundColor ?? "#eee" },
        ];
      default:
        return [styles.baseButton, styles.actionButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "signUpComplete":
        return styles.signUpCompleteText;
      case "submit":
        return styles.submitText;
      case "check":
        return styles.checkText;
      case "login":
        return styles.loginText;
      case "socialLogin":
        return [styles.socialText, { color: textColor ?? "#000" }];
      default:
        return styles.actionText;
    }
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      {variant === "socialLogin" && icon && (
        <View style={styles.socialIcon}>{icon}</View>
      )}

      {variant === "socialLogin" ? (
        <View style={styles.socialTextWrapper}>
          <Text style={getTextStyle()}>{text}</Text>
        </View>
      ) : variant === "check" ? (
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
