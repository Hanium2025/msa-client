import React from "react";
import { Ionicons } from "@expo/vector-icons";
import style from "./CheckButton.style";

interface CheckIconProps {
  checked: boolean;
}

export default function CheckIcon({ checked }: CheckIconProps) {
  return (
    <Ionicons
      name={checked ? "checkmark-circle" : "ellipse-outline"}
      size={20}
      color="#084C63"
      style={style.button}
    />
  );
}
