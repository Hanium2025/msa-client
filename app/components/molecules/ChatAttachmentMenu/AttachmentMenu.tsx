// components/molecules/AttachmentMenu.tsx
import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AttachmentMenuProps = {
  visible: boolean;
  onClose: () => void;
  anchor?: { x: number; y: number; w: number; h: number } | null;
  onPickImage?: () => void;        // 옵션
  onRequestMeetup?: () => void;    //옵션
  onRequestDelivery?: () => void;  // 옵션
};

type Action = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function AttachmentMenu({
  visible,
  onClose,
  onPickImage,
  onRequestMeetup,
  onRequestDelivery,
  anchor,
}: AttachmentMenuProps) {
  // 전달된 핸들러만 actions에 포함
  const actions: Action[] = [
    onPickImage && { label: "사진 전송", icon: "image-outline", onPress: onPickImage },
    onRequestMeetup && { label: "직거래 요청", icon: "location-outline", onPress: onRequestMeetup },
    onRequestDelivery && { label: "택배 거래 요청", icon: "cube-outline", onPress: onRequestDelivery },
  ].filter(Boolean) as Action[];

  const { width: W, height: H } = Dimensions.get("window");
  const MENU_WIDTH = 220;
  const BTN_W = anchor?.w ?? 36;
  const anchorX = anchor?.x ?? 16;
  const anchorY = anchor?.y ?? H - 64;
  const menuLeft = Math.max(8, Math.min(anchorX - (MENU_WIDTH - BTN_W), W - MENU_WIDTH - 8));
  const menuBottom = Math.max(72, H - (anchorY + (anchor?.h ?? 36)) + 8);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.menu, { left: menuLeft, bottom: menuBottom, width: MENU_WIDTH }]}>
          {actions.map((a, idx) => (
            <MenuItem
              key={idx}
              label={a.label}
              rightIcon={a.icon}
              onPress={() => {
                onClose();
                a.onPress(); // 존재하는 핸들러만 호출
              }}
            />
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({
  label,
  rightIcon,
  onPress,
}: {
  label: string;
  rightIcon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name={rightIcon} size={18} color="#111827" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "transparent" },
  menu: {
    position: "absolute",
    backgroundColor: Platform.select({ ios: "rgba(255,255,255,0.96)", android: "#FFFFFF" }),
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  item: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPressed: { backgroundColor: "#F3F4F6" },
  itemLabel: { fontSize: 16, color: "#111827" },
});
