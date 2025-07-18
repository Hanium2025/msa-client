import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CheckButton from "../../atoms/CheckButton";
import { Ionicons } from "@expo/vector-icons";
import style from "./TermRow.style";

interface TermRowProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  showSeeAll?: boolean;
  bold?: boolean;
}

export default function TermRow({
  label,
  checked,
  onPress,
  showSeeAll = true,
  bold = false,
}: TermRowProps) {
  return (
    <TouchableOpacity style={style.termRow} onPress={onPress}>
      <CheckButton checked={checked} />
      <Text style={[style.termText, bold && style.boldText]}>{label}</Text>
      <View style={style.flexSpacer} />
      {showSeeAll && (
        <>
          <Text style={style.seeAll}>전체보기</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </>
      )}
    </TouchableOpacity>
  );
}
