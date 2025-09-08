import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UnreadBadge({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.txt}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
