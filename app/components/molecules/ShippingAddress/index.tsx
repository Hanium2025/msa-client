import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import CheckIcon from "../../atoms/CheckIcon";
import styles from "./ShippingAddress.style";

type Props = {
  name: string;
  address: string;
  phone: string;
};

export default function ShippingAddress({ name, address, phone }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <CheckIcon />
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.textTitle}>{name}</Text>
        <Text style={styles.textBody}>{address}</Text>
        <Text style={styles.textBody}>{phone}</Text>
      </View>
    </View>
  );
}
