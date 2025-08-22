// hooks/useHomeProducts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchHomeApi } from "../lib/api/product";
import { tokenStore } from "../auth/tokenStore";
import type { ImageSourcePropType } from "react-native";

// NewProductsSection 이 받는 형태와 동일하게 정의
export type HomeProductForSection = {
  id: string;
  name: string;
  price: string;                // "9,000원"
  image: ImageSourcePropType;   // { uri: ... } 또는 data URI
};

// 이미지 URL이 비어있을 때 쓸 1x1 투명 이미지 (웹/네이티브 공용)
const TRANSPARENT_PX_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const fmtKRW = (n: number) => `${new Intl.NumberFormat("ko-KR").format(n)}원`;

export function useHomeProducts() {
  return useQuery({
    queryKey: ["home-products"],
    queryFn: async (): Promise<HomeProductForSection[]> => {
      const token = await tokenStore.get();
      const { products } = await fetchHomeApi(token || undefined);
      return products.map((p) => ({
        id: String(p.productId),
        name: p.title,
        price: fmtKRW(Number(p.price)),
        image: p.imageUrl
          ? { uri: p.imageUrl }
          : { uri: TRANSPARENT_PX_URI }, // 빈 URL 대비 안전한 기본값
      }));
    },
    staleTime: 60_000,
    retry: 1,
  });
}
