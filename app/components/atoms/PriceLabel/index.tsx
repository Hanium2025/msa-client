import React from "react";
import { Text } from "react-native";
import { styles } from "./PriceLabel.style";

type Props = { value: number };

export const PriceLabel: React.FC<Props> = ({ value }) => {
  const formatted = new Intl.NumberFormat("ko-KR").format(value);
  return <Text style={styles.price}>{formatted}원</Text>;
};
