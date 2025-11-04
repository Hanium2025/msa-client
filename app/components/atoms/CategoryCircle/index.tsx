import React from 'react';
import { View, Text, Image, ImageSourcePropType, ImageResolvedAssetSource } from 'react-native';
import { CategoryCircleStyles as styles } from './categoryCircle.style';

interface Props {
  name: string;
  icon?: ImageSourcePropType;
}

export const CategoryCircle = ({ name, icon }: Props) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      {icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
    </View>
    <Text
      style={styles.text}
      numberOfLines={2}
      ellipsizeMode="tail"
      adjustsFontSizeToFit
      minimumFontScale={0.85}
    >
      {name}
    </Text>
  </View>
);
