import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './SectionHeader.style';

interface Props {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

export default function SectionHeader({ title, subtitle, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}
