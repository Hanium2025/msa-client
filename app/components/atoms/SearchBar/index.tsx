import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center', // 수평 중앙 정렬
    marginTop: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: 313,
    height: 57,
    paddingHorizontal: 12,

    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    backgroundColor: '#FFF',

    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
