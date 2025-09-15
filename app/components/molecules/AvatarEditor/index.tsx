import React from "react";
import { View } from "react-native";
import AvatarCircle from "../../atoms/AvatarCircle";
import Button from "../../atoms/Button";
import styles from "./AvatarEditor.style";

type Props = {
  uri?: string;
  onPickImage?: () => void;
  size?: number;
};

export default function AvatarEditor({ uri, onPickImage, size = 220 }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <AvatarCircle uri={uri} size={size} />
      <Button
        variant="profileEditCircle"
        onPress={() => onPickImage?.()} 
        text="프로필 이미지 수정"
        iconSource={require("../../../../assets/images/edit-pencil.png")}
        style={styles.editBtn} // absolute: { right: 10, bottom: 10 }
      />
    </View>
  );
}
