import React, { useState, useCallback } from "react";
import { SafeAreaView, StatusBar, View, StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationList from "../components/organisms/NotificationList";
import { NotificationItem } from "../components/molecules/NotificationRow";
import BottomTabBar from "../components/molecules/BottomTabBar";

const PHONE_WIDTH = 390;

const initialData: NotificationItem[] = [
  {
    id: "1",
    category: "COMMUNITY",
    title: "커뮤니티",
    message: "[홍길동]님의 게시글에 새 좋아요가 달렸어요.",
    time: "9:41 AM",
  },
  {
    id: "2",
    category: "TRADE",
    title: "거래",
    message: "[상품명A…] 상품의 거래 상태가 [거래 완료](으)로 변경되었어요.",
    time: "9:41 AM",
  },
  {
    id: "3",
    category: "TRADE",
    title: "거래",
    message: "[상품명A…] 상품의 거래 상태가 [배송 완료](으)로 변경되었어요.",
    time: "9:41 AM",
  },
];

export default function NotificationScreen() {
  const [items, setItems] = useState(initialData);
  const [activeTab, setActiveTab] = useState("notifications");

  const onPressItem = useCallback((item: NotificationItem) => {
    console.log("Pressed:", item);
  }, []);

  const onDeleteItem = useCallback((item: NotificationItem) => {
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  }, []);

  const onTabPress = (tab: string) => setActiveTab(tab);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.webRoot}>
        <SafeAreaView style={styles.phoneFrame}>
          <StatusBar barStyle="dark-content" />

          <NotificationList
            data={items}
            onPressItem={onPressItem}
            onDeleteItem={onDeleteItem}
          />

          {/* 하단 탭바 */}
          <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
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
