// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18 }}>상품 상세 페이지</Text>
      <Text>상품 ID: {id}</Text>
    </View>
  );
}
