import React from 'react';
import { ScrollView, Image, View, StyleSheet } from 'react-native';

interface Props {
  images: string[];
}

export default function ImageCarousel({ images }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {images.map((img, index) => (
        <View key={index} style={styles.imageWrapper}>
          <Image
            source={img ? { uri: img } : require('../../../../assets/images/image-placeholder.png')}
            style={styles.image}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginVertical: 10,
  },
  imageWrapper: {
    marginRight: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
});
