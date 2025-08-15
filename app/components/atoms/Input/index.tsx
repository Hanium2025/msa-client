import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { styles } from './Input.style';

export const Input = (props: TextInputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#aaa"
      {...props}
    />
  );
};