import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  nickname: string;
  postedAt: string;
}

export default function UserInfo({ nickname, postedAt }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/image-placeholder.png')}
        style={styles.image}
      />
      <View>
        <Text style={styles.name}>{nickname}</Text>
        <Text style={styles.time}>{postedAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#084C63',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
});
