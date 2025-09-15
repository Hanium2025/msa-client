import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, View, StyleSheet, Platform } from "react-native";
import ShipmentTracking from "../components/organisms/ShipmentTracking";
import type { TrackingEvent } from "../components/molecules/TrackingTable";
import BottomTabBar from "../components/molecules/BottomTabBar";

const PHONE_WIDTH = 390;

export default function WaybillTrackScreen() {
  const [activeTab, setActiveTab] = useState("home");

  // 데모 데이터
  const events: TrackingEvent[] = useMemo(() => ([
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "배송준비중" },
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "집화완료" },
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "배송중" },
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "지점도착" },
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "배송출발" },
    { time: "2025-09-01 12:12:12", location: "남서울 터미널", status: "배송 완료" },
  ]), []);

  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <ShipmentTracking
            courierName="CJ 대한통운"
            waybill="1234567891"
            events={events}
          />
        </ScrollView>

        <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#F5F6F7" : "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    width: Platform.OS === "web" ? PHONE_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
});
