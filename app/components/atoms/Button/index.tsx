import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Button.style';
import { LinearGradient } from 'expo-linear-gradient';

// 일반 버튼
interface ButtonProps {
  text: string;
  onPress: () => void;
}

export const Button = ({ text, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

// 상품 등록 버튼
interface RegisterItemButtonProps {
  onPress: () => void;
}

export const RegisterItemButton = ({ onPress }: RegisterItemButtonProps) => {
  return (
    <View style={styles.wrapper}> {/* ✅ 중앙 정렬용 wrapper */}
      <LinearGradient
        colors={['#023047', 'limegreen']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <TouchableOpacity style={styles.registerItem} onPress={onPress}>
          <Ionicons name="add-circle" size={20} color="#333" />
          <Text style={styles.text}>내 물품 등록하기</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
