import React from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Slot } from "expo-router";

const IP14_PRO_WIDTH = 393; 
const IP14_PRO_HEIGHT = 852;  

export default function CategoryLayout() {
  return (
    <View style={styles.webRoot}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" />
        <Slot />
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
    maxWidth: Platform.OS === "web" ? IP14_PRO_WIDTH : undefined,
    width: Platform.OS === "web" ? IP14_PRO_WIDTH : undefined,
    alignSelf: "center",
    borderRadius: Platform.OS === "web" ? 24 : 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
});
