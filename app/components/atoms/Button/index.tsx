// Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./Button.style";

interface ButtonProps {
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  isPressed?: boolean;
  text: string;
  style?: StyleProp<ViewStyle>;
  variant?:
    | "action"
    | "submit"
    | "signUpComplete"
    | "check"
    | "login"
    | "socialLogin"
    | "registerItem"
    | "reportSubmit"
    | "reportToProduct"
    | "reportToHome"
    | "profilePrimary"
    | "profileOutline"
    | "profileEditCircle"
    | "waybillPrimary"
    | "waybillSelect"
    | "paymentRetry"; 
  checked?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconSource?: ImageSourcePropType;
  iconName?: string;  
  iconSize?: number;  
  backgroundColor?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  onPressIn,
  onPressOut,
  isPressed = false,
  text,
  style,
  variant = "action",
  checked = false,
  disabled = false,
  icon,
  iconSource,             
  iconName = "create",   
  iconSize = 18,
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
              source={require("../../../../assets/images/add-circle.png")} 
              style={styles.registerImage}
              resizeMode="contain"
            />
            <Text style={styles.registerText}>{text}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (variant === "reportSubmit") {
    return (
      <TouchableOpacity
        style={styles.reportSubmitButton}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <View style={styles.reportSubmitContent}>
          <Image
            source={require("../../../../assets/images/report-image.svg")} 
            style={styles.reportSubmitImage}
            resizeMode="contain"
          />
          <Text style={styles.reportSubmitText}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === "profileEditCircle") {
    return (
      <TouchableOpacity
        style={[styles.profileEditCircleButton, style]}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={text || "프로필 이미지 수정"}
      >
        {iconSource ? (
          <Image
            source={iconSource}
            style={styles.profileEditCircleIcon} 
            resizeMode="contain"
          />
        ) : (
          <Ionicons name={iconName as any} size={iconSize} color="#FFF" />
        )}
      </TouchableOpacity>
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
      case "reportToProduct":
        return [
          styles.reportToProductButton,
          disabled && styles.reportToProductDisabled,
        ];
      case "reportToHome":
        return [
          styles.reportToHomeButton,
          disabled && styles.reportToHomeDisabled,
        ];
      case "profilePrimary":
        return [styles.profilePrimaryButton];
      case "profileOutline":
        return [styles.profileOutlineButton];
      case "waybillPrimary":
        return [styles.waybillPrimaryButton];
      case "waybillSelect":
        return [styles.waybillSelectButton];
      case "paymentRetry":        
      return [styles.paymentRetryButton, isPressed && styles.paymentRetryPressed, disabled && styles.paymentRetryDisabled];
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
      case "reportToProduct":
        return styles.reportToProductText;
      case "reportToHome":
        return styles.reportToHomeText;
      case "profilePrimary":
        return styles.profilePrimaryText;
      case "profileOutline":
        return styles.profileOutlineText;
      case "waybillPrimary":
        return styles.waybillPrimaryText;
      case "waybillSelect":
        return styles.waybillSelectText;
      case "paymentRetry":       
      return styles.paymentRetryText;
      default:
        return styles.actionText;
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={0.85}
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
      ) : variant === "waybillPrimary" ? (
        // 송장등록 아이콘 + 텍스트 가로 배치
        <View style={styles.row}>
          {iconSource ? (
            <Image source={iconSource} style={styles.waybillPrimaryIcon} />
          ) : null}
          <Text style={getTextStyle()}>{text}</Text>
        </View>
      ) : variant === "waybillSelect" ? (
        // “선택” 작은 텍스트 버튼
        <View style={styles.row}>
          <Text style={getTextStyle()}>{text}</Text>
          {iconSource ? (
            <Image source={iconSource} style={styles.waybillSelectIcon} />
          ) : (
            <Ionicons name="chevron-down" size={16} color="#8A8A8A" />
          )}
        </View>
      ) : (
        <Text style={getTextStyle()}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
