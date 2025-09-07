import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, StyleSheet as RNStyleSheet } from 'react-native';

interface ProductOwnerActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const IOS_BLUE = '#007AFF';
const IOS_RED  = '#FF3B30';
const HAIRLINE = RNStyleSheet.hairlineWidth;

export default function ProductOwnerActions({ onEdit, onDelete }: ProductOwnerActionsProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(false);
    onDelete();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.buttonText}>수정하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>삭제하기</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.card}>
            <Text style={styles.title}>정말 삭제할까요?</Text>

            {/* 상단 헤어라인 */}
            <View style={styles.topDivider} />

            {/* 버튼 영역 */}
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
              >
                <Text style={styles.cancelLabel}>취소</Text>
              </Pressable>

              {/* 가운데 세로 구분선 */}
              <View style={styles.verticalDivider} />

              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
              >
                <Text style={styles.destructiveLabel}>삭제</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 341,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    marginRight: 130,
    marginLeft: 25,
  },
  deleteButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#000',
  },

  // Modal (iOS Alert 스타일)
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 280,                  // iOS Alert 비율
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',          // 하단 라운드 유지
  },
  title: {
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  topDivider: {
    height: HAIRLINE,
    backgroundColor: '#D9D9D9',
  },
  actionsRow: {
    flexDirection: 'row',
    height: 44,                  // iOS 기본 버튼 높이
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPressed: {
    backgroundColor: '#F2F2F2',  // 터치 시 하이라이트
  },
  verticalDivider: {
    width: HAIRLINE,
    backgroundColor: '#D9D9D9',
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: IOS_BLUE,
  },
  destructiveLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: IOS_RED,
  },
});
