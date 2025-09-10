import { View, StyleSheet } from "react-native";
import ShippingAddress from "../molecules/ShippingAddress";
import ShippingSelection from "../molecules/ShippingSelection";
import DropdownMenu from "../atoms/DropdownMenu";

export default function ShippingInfo() {
  return (
    <View style={styles.container}>
      <ShippingSelection />
      <ShippingAddress
        name="홍길동"
        address="서울 성북구 화랑로"
        phone="010-1234-5678"
      />
      <DropdownMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: 314,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 16,
  },
});
