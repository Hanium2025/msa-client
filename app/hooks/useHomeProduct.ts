// hooks/useHomeProducts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchHomeApi } from "../lib/api/product";
import { tokenStore } from "../auth/tokenStore";
import type { ImageSourcePropType } from "react-native";


export type HomeProductForSection = {
  id: string;
  name: string;
  price: string;                
  image: ImageSourcePropType;   
};

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
