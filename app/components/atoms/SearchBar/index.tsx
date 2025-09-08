import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./SearchBar.style";

type Props = {
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void; // 엔터/아이콘 클릭 시 실행

  onTrigger?: () => void;
};

export const SearchBar = ({ 
  value, 
  onChangeText, 
  onSubmit,
  onTrigger, 
}: Props) => {
  if (onTrigger) {
    return (
      <View style={styles.wrapper}>
        <Pressable style={styles.container} onPress={onTrigger} hitSlop={8}>
          <Ionicons name="search" size={20} color="#999" />
        </Pressable>
      </View>
    );
  }

  return(
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        <Ionicons name="search" size={20} color="#999" onPress={onSubmit}/>
      </View>
    </View>
  )
  };