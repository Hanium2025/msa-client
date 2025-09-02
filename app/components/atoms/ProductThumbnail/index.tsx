import React from "react";
import { Image, View } from "react-native";
import { styles } from "./ProductThumbnail.style";

type Props = { uri?: string };

export const ProductThumbnail: React.FC<Props> = ({ uri }) => {
  if (!uri) return <View style={styles.skeleton} />;
  return <Image source={{ uri }} style={styles.image} resizeMode="cover" />;
};
