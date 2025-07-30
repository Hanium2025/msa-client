import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    title: string;
    subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: Props) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Ionicons name="chevron-forward" size={16} color="#999" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: 360, // 카드 3개 x 120 너비 기준
        alignSelf: 'center', // ✅ 수평 중앙 정렬
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    subtitle: {
        fontSize: 12,
        color: '#999',
        marginRight: 4,
    },
});
