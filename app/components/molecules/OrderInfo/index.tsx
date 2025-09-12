import { Text, View, ImageSourcePropType } from "react-native";
import styles from "./OrderInfo.style";

interface Props {
  title: string;
  price: string; // 추후 수정 ..
  shippingFee: string;
  totalPrice: string;
  image: ImageSourcePropType;
  sellerNickname: string;
}

export default function OrderInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>주문내역</Text>
        <View style={styles.productContainer}>
          <View style={styles.imageGrid} />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>프리미엄 유모차</Text>
            <Text style={styles.sellerName}>판매자: 홍길동</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsLabel}>상품 가격:</Text>
            <Text style={styles.priceDetailsValue}>1,200,000원</Text>
          </View>
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsLabel}>배송비:</Text>
            <Text style={styles.priceDetailsValue}>0원</Text>
          </View>
        </View>
        <View style={styles.priceDetails}>
          <Text style={styles.totalPriceLabel}>총 결제 금액:</Text>
          <Text style={styles.totalPriceValue}>1,200,000원</Text>
        </View>
      </View>
    </View>
  );
}
