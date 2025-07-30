import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface ProductOwnerActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

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

            <Modal transparent animationType="fade" visible={modalVisible}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>정말로 삭제하시겠습니까?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleDelete}>
                                <Text style={styles.confirmText}>삭제</Text>
                            </TouchableOpacity>
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
        borderWidth: 1,               // 테두리 두께
        borderColor: '#D1D1D1',
        marginRight: 130,
        marginLeft: 25,
    },
    deleteButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,               // 테두리 두께
        borderColor: '#D1D1D1',
    },
    buttonText: {
        fontWeight: '500',
        fontSize: 14,
        color: '#000',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 260,
        height: 109,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelButton: {
        backgroundColor: '#E5E5E5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 8,
    },
    confirmButton: {
        backgroundColor: '#FF5A5A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelText: {
        color: '#333',
        fontWeight: '600',
    },
    confirmText: {
        color: '#FFF',
        fontWeight: '600',
    },
});
