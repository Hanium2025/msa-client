import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import styles from "./DropdownMenu.style";
import DropdownArrow from "../DropdownArrow";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const label = selected ?? "배송 시 요청 사항을 선택해 주세요";
  const labelColor = selected ? "#000" : "rgba(0,0,0,0.44)";
  const handleToggle = () => setOpen((v) => !v);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handleToggle}
        style={() => [styles.box]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={[styles.textBox, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>

        <Pressable onPress={handleToggle} hitSlop={8}>
          <DropdownArrow width={22} height={22} />
        </Pressable>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          {[
            "문 앞에 놓아주세요",
            "무인택배함에 놓아주세요",
            "부재 시 경비실에 맡겨주세요",
          ].map((opt) => (
            <Pressable
              key={opt}
              onPress={() => {
                setSelected(opt);
                setOpen(false);
              }}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
            >
              <Text style={styles.menuItemText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
