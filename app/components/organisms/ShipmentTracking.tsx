// components/organisms/ShipmentTracking.tsx
import React from "react";
import { Image, Linking, Platform, StyleSheet, Text, View } from "react-native";
import InfoRow from "../atoms/InfoRow";
import TrackingTable, { TrackingEvent } from "../molecules/TrackingTable";

const TRUCK_ICON = require("../../../assets/images/truck.png");

type Props = {
  courierName: string;
  waybill: string;
  events: TrackingEvent[];
  onPressCourier?: () => void;  
  onPressWaybill?: () => void;   
};

export default function ShipmentTracking({
  courierName,
  waybill,
  events,
  onPressCourier,
  onPressWaybill,
}: Props) {
  const openCourier = () => {
    if (onPressCourier) return onPressCourier();
    // 기본: CJ대한통운 조회 페이지로 이동
    Linking.openURL(
      `https://trace.cjlogistics.com/next/tracking.html?wblNo=${encodeURIComponent(
        waybill
      )}`
    );
  };

  const openWaybill = () => {
    if (onPressWaybill) return onPressWaybill();
    openCourier();
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Image source={TRUCK_ICON} style={styles.titleIcon} resizeMode="contain" />
        <Text style={styles.title}>실시간 배송 현황</Text>
      </View>

      <InfoRow label="택배사" value={courierName} onPressValue={openCourier} alignRight />
      <InfoRow label="송장번호" value={waybill} onPressValue={openWaybill} alignRight/>

      <TrackingTable data={events} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 341,
    height: 636,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    // 그림자
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
      web: {
        // RN Web 전용
        // @ts-ignore
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      },
    }),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    justifyContent: "center",
  },
  titleIcon: {},
  title: {
    fontSize: 16,
    textAlign: "center", 
    fontWeight: "800",
    color: "#1D1D1F",
  },
});
