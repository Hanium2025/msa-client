import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './BottomButtonGroup.style';

interface Props {
    status: 'ON_SALE' | 'IN_PROGRESS' | 'SOLD_OUT';
    onChat: () => void;
}

export default function BottomButtonGroup({ status, onChat }: Props) {
    let statusText = '';
    switch (status) {
        case 'ON_SALE':
            statusText = '판매 중';
            break;
        case 'IN_PROGRESS':
            statusText = '거래 중';
            break;
        case 'SOLD_OUT':
            statusText = '거래 완료';
            break;
    }

    const isSoldOut = status === 'SOLD_OUT';

    return (
        <View style={styles.container}>
            <View style={styles.statusBox}>
                <Text style={styles.statusText}>{statusText}</Text>
            </View>
            <TouchableOpacity
                style={styles.buttonDark}
                onPress={onChat}
                disabled={isSoldOut}
            >
                <Text style={styles.buttonText}>판매자와 채팅하기</Text>
            </TouchableOpacity>
        </View>

    );
}
