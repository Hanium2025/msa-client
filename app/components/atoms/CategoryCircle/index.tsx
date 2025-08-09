import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
}

export const CategoryCircle = ({ name }: Props) => (
  <View style={styles.container}>
    <View style={styles.circle} />
    <Text style={styles.text}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 10,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: '#666',
  },
});
