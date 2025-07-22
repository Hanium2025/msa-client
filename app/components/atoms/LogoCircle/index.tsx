import React from "react";
import { View } from "react-native";
import styles from "./LogoCircle.style";

export default function LogoCircle() {
  return (
    <View style={styles.logoCircle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="196"
        height="196"
        viewBox="0 0 196 196"
        fill="none"
      >
        <circle cx="98" cy="97.9532" r="97.9532" fill="#D9D9D9" />
      </svg>
    </View>
  );
}
