import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./ActionButton.style";

interface ActionButtonProps {
  onPress: () => void;
  text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
