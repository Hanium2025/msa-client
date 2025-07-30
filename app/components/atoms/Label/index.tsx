import React from 'react';
import { Text } from 'react-native';

export const Label = ({ text, required = false }: { text: string; required?: boolean }) => {
  return (
    <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
      {required && <Text style={{ color: '#f00' }}>* </Text>}
      {text}
    </Text>
  );
};