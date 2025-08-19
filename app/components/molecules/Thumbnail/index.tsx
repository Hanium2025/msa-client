// components/molecules/Thumbnail.tsx
import React from "react";
import { View, Image, TouchableOpacity, Text, Platform, StyleSheet } from "react-native";

type Props = {
  uri?: string;
  isNew?: boolean;
  onRemove: () => void;
};

export function Thumbnail({ uri, isNew, onRemove }: Props) {
  return (
    <View style={styles.thumb}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumbImg} />
      ) : (
        <View style={[styles.thumbImg, { alignItems: "center", justifyContent: "center" }]}>
          <Text>새 이미지</Text>
        </View>
      )}
      <TouchableOpacity onPress={onRemove} style={styles.closeBtn}>
        <Text style={styles.closeTxt}>×</Text>
      </TouchableOpacity>
      <View style={[styles.badge, isNew ? styles.badgeNew : null]}>
        <Text style={styles.badgeTxt}>{isNew ? "신규" : "기존"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 192,
    height: 124,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#eee",
    marginRight: 8,
  },
  thumbImg: { width: "100%", height: "100%" },
  closeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeTxt: { color: "#fff", fontSize: 16, lineHeight: 16, fontWeight: "700" },
  badge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "#111",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    opacity: 0.85,
  },
  badgeNew: { backgroundColor: "#0d6efd" },
  badgeTxt: { color: "#fff", fontSize: 11 },
});
