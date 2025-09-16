import React, { useMemo } from "react";
import { Modal, View, Text, Pressable, FlatList, Dimensions } from "react-native";
import styles from "./AnchoredSelect.style";

export type Anchor = { x: number; y: number; width: number; height: number } | null;
type Item = string | { label: string; value: string };

type Props = {
  visible: boolean;
  items: Item[];
  selected?: string;
  anchor: Anchor;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export default function AnchoredSelect({
  visible,
  items,
  selected,
  anchor,
  onSelect,
  onClose,
}: Props) {
  const data = useMemo(
    () => items.map(i => (typeof i === "string" ? { label: i, value: i } : i)),
    [items]
  );

  const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
  const MENU_W = 240;
  const MAX_H = 260;
  const GAP = 6;

  const top = useMemo(() => {
    if (!anchor) return SCREEN_H / 3;
    const below = anchor.y + anchor.height + GAP; 
    const canFit = below + MAX_H <= SCREEN_H - 8;
    return canFit ? below : Math.max(8, anchor.y - MAX_H - GAP);
  }, [anchor, SCREEN_H]);

  const left = useMemo(() => {
    if (!anchor) return (SCREEN_W - MENU_W) / 2;
    const alignRight = anchor.x + anchor.width - MENU_W;
    return Math.max(8, Math.min(alignRight, SCREEN_W - MENU_W - 8));
  }, [anchor, SCREEN_W]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.menu, { top, left, width: MENU_W }]}>
        <FlatList
          data={data}
          keyExtractor={(it) => it.value}
          renderItem={({ item }) => {
            const active = selected === item.value;
            return (
              <Pressable
                onPress={() => { onSelect(item.value); onClose(); }}
                style={({ pressed }) => [
                  styles.item,
                  active && styles.itemActive,
                  pressed && styles.itemPressed,
                ]}
              >
                <Text style={[styles.itemText, active && styles.itemTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          style={{ maxHeight: MAX_H }}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Modal>
  );
}
