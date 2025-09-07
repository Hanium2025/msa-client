import React from "react";
import { View, Image } from "react-native";
import styles from "./LogoCircle.style";

export default function LogoCircle() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("../../../../assets/images/service_logo.png")}
        style={styles.logo}
        resizeMode="cover"
      />
    </View>
  );
}
