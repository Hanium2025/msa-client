import React, { useRef } from "react";
import { View, Pressable } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import NotificationAvatar from "../../atoms/NotificationAvatar";
import TextBody from "../../atoms/TextBody";
import TimeText from "../../atoms/TimeText";
import IconCircle from "../../atoms/IconCircle";
import styles from "./NotificationRow.style";

export type NotificationItem = {
  id: string;
  category: "COMMUNITY" | "TRADE";
  title: string;
  message: string;
  time: string;
  thumbnail?: any;
};

type Props = {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
  onDelete?: (item: NotificationItem) => void;
};

export default function NotificationRow({ item, onPress, onDelete }: Props) {
  const ref = useRef<Swipeable | null>(null);

  const renderRightActions = () => (
    <View style={styles.rightActionWrap}>
      <IconCircle
        source={require("../../../../assets/images/trash.png")}
      onPress={() => {
        onDelete?.(item);
        ref.current?.close();
      }}
      />
    </View>
  );

  return (
    <Swipeable
      ref={ref}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <Pressable onPress={() => onPress?.(item)} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
        <NotificationAvatar size={44} source={item.thumbnail} />
        <View style={styles.content}>
          <View style={styles.headerLine}>
            <TextBody style={styles.title}>{item.title}</TextBody>
            <TimeText value={item.time} />
          </View>
          <TextBody numberOfLines={2} style={styles.message}>
            {item.message}
          </TextBody>
        </View>
      </Pressable>
    </Swipeable>
  );
}
