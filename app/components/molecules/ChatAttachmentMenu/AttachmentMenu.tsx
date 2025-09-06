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
  onPickImage: () => void;
  onRequestMeetup: () => void;
  onRequestDelivery: () => void;
  // (선택) +버튼 위치(화면 좌표). 주면 거기에 맞춰 뜸. 안 주면 좌하단 근처 기본 위치.
  anchor?: { x: number; y: number; w: number; h: number } | null;
};

export function AttachmentMenu({
  visible,
  onClose,
  onPickImage,
  onRequestMeetup,
  onRequestDelivery,
  anchor,
}: AttachmentMenuProps) {
  const { width: W, height: H } = Dimensions.get("window");

  const MENU_WIDTH = 220;
  const BTN_W = anchor?.w ?? 36;
  const anchorX = anchor?.x ?? 16;
  const anchorY = anchor?.y ?? H - 64; // 대략 키보드/풋터 위
  const menuLeft = Math.max(
    8,
    Math.min(anchorX - (MENU_WIDTH - BTN_W), W - MENU_WIDTH - 8)
  );
  // + 버튼 바로 위로 살짝 띄워서
  const menuBottom = Math.max(72, H - (anchorY + (anchor?.h ?? 36)) + 8);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 바깥을 탭하면 닫힘 */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.menu,
            { left: menuLeft, bottom: menuBottom, width: MENU_WIDTH },
          ]}
        >
          <MenuItem
            label="사진 전송"
            rightIcon="image-outline"
            onPress={() => {
              onClose();
              onPickImage();
            }}
          />
          <MenuItem
            label="직거래 요청"
            rightIcon="location-outline"
            onPress={() => {
              onClose();
              onRequestMeetup();
            }}
          />
          <MenuItem
            label="택배 거래 요청"
            rightIcon="cube-outline" // Ionicons에 트럭이 없어 cube로 대체(택배 느낌)
            onPress={() => {
              onClose();
              onRequestDelivery();
            }}
          />
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
  rightIcon: keyof typeof Ionicons.glyphMap | string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name={rightIcon as any} size={18} color="#111827" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "transparent" },
  menu: {
    position: "absolute",
    backgroundColor: Platform.select({
      ios: "rgba(255,255,255,0.94)",
      android: "#FFFFFF",
    }),
    borderRadius: 16,
    paddingVertical: 6,
    // shadow
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
