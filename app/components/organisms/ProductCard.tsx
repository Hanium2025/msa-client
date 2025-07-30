import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserInfo from '../molecules/UserInfo';
import ImageCarousel from '../molecules/ImageCarousel';
import PriceText from '../atoms/PriceText';
import Tag from '../atoms/Tag';

interface Product {
    title: string;
    price: number;
    category: string;
    description: string;
    user: {
        nickname: string;
        postedAt: string;
    };
    status: 'ON_SALE' | 'IN_PROGRESS' | 'SOLD_OUT';
    likeCount: number;
    images: string[];
}

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <View style={styles.card}>
            {/* 제목 + 가격 우측 정렬 */}
            <View style={styles.titleRow}>
                <Text style={styles.title}>{product.title}</Text>
                <PriceText price={product.price} />
            </View>

            <View style={styles.userRow}>
                <UserInfo
                    nickname={product.user.nickname}
                    postedAt={product.user.postedAt}
                />
                <Tag label={product.category} />
            </View>

            {/* 이미지 */}
            <ImageCarousel images={product.images} />

            {/* 설명 */}
            <Text style={styles.description}>{product.description}</Text>

            {/* 좋아요 수 */}
            <Text style={styles.likes}>⭐ {product.likeCount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 341,
        height: 570,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
        marginRight: 8,
    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tagRight: {
        alignItems: 'flex-end',
        width: '100%',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#333',
        marginTop: 12,
    },
    likes: {
        fontSize: 13,
        color: '#888',
        marginTop: 8,
    },
});
