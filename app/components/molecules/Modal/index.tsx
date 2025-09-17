import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { styles } from "./Modal.style";

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  onClose: () => void; // 취소/닫기
  onConfirm: () => void; // 확인/제출
};

export const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  cancelText = "취소",
  confirmText = "제출",
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Pressable style={styles.btn} onPress={onClose}>
              {({ pressed }) => (
                <View style={[styles.btnInner, pressed && styles.btnPressed]}>
                  <Text style={[styles.btnText, styles.btnPrimary]}>
                    {cancelText}
                  </Text>
                </View>
              )}
            </Pressable>

            <View style={styles.dividerV} />

            <Pressable style={styles.btn} onPress={onConfirm}>
              {({ pressed }) => (
                <View style={[styles.btnInner, pressed && styles.btnPressed]}>
                  <Text style={[styles.btnText, styles.btnPrimary]}>
                    {confirmText}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
