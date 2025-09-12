import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ShippingAddress from "../molecules/ShippingAddress";
import ShippingSelection from "../molecules/ShippingSelection";
import DropdownMenu from "../atoms/DropdownMenu";
import NewAddressForm, { NewAddress } from "../molecules/NewAddressForm";

type Option = "existing" | "new";

type Props = {
  onTabChange?: (v: Option) => void;
};

export default function ShippingInfo({ onTabChange }: Props) {
  const [tab, setTab] = useState<Option>("existing");

  const handleSelect = (v: Option) => {
    setTab(v);
    onTabChange?.(v);            
  };

  return (
    
    <View style={styles.container}>
      <ShippingSelection
        defaultValue="existing"
        onSelect={handleSelect}
      />
      {tab === "existing" ? (
        <>
          <ShippingAddress
            name="홍길동"
            address="서울특별시 성북구 화랑로 13길 60"
            phone="010-1234-5678"
          />
          <DropdownMenu />
        </>
      ) : (
        <NewAddressForm
          onFindPostcode={(fill) => {
            // TODO: 다음(카카오) 연동 후 받아온 값으로 채워넣기
            // fill({ zipcode: "02831", address1: "서울특별시 성북구 화랑로 13길 60" });
          }}
          onSave={(form: NewAddress) => {
            // TODO: 신규 주소 저장 API
            // 저장 성공 시 기존 배송지 탭으로 전환/리스트 리프레시
            setTab("existing");
            // refreshExistingAddresses?.();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: 360,
    flexDirection: "column",
    alignSelf: "center",
    gap: 16,
  },
});
