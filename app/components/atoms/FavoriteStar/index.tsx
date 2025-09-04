import React from "react";
import { Pressable, View, Image } from "react-native";
import { styles } from "./FavoriteStar.style";

type Props = { filled?: boolean; onPress?: () => void };

export const FavoriteStar: React.FC<Props> = ({ filled, onPress }) => {
  return (
    <View style={styles.wrap}>
      <Pressable hitSlop={8} onPress={onPress}>
        <Image
          source={
            filled
              ? require("../../../../assets/images/star-filled.png")
              : require("../../../../assets/images/star.png")
          }
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};
