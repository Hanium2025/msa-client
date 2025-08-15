import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = () => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
      />
      <Ionicons name="search" size={20} color="#999" />
    </View>
  </View>
);

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
