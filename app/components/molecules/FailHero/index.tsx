import React from "react";
import { View } from "react-native";
import Heading from "../../atoms/Heading";
import SadFace from "../../atoms/SadFace";
import styles from "./FailHero.style";

export default function FailHero() {
  return (
    <View style={styles.container}>
      <Heading>결제에 실패했어요</Heading>
      <SadFace />
    </View>
  );
}
