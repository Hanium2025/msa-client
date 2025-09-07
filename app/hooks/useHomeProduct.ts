// hooks/useHomeProducts.ts
import { useEffect, useState } from "react";
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

export type HomeCategoryForSection = {
  name: string;
  image: ImageSourcePropType;
};

const TRANSPARENT_PX_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const fmtKRW = (n: number) => `${new Intl.NumberFormat("ko-KR").format(n)}원`;

export function useHomeProducts() {
  const [authKey, setAuthKey] = useState<"anon" | "auth">("anon");
  useEffect(() => {
    tokenStore.get().then((t) => setAuthKey(t ? "auth" : "anon"));
  }, []);

  return useQuery({
    queryKey: ["home-products", authKey], 
    queryFn: async (): Promise<{
      products: HomeProductForSection[];
      categories: HomeCategoryForSection[];
    }> => {
      const token = await tokenStore.get();
      const { products, categories } = await fetchHomeApi(token || undefined);

      const mappedProducts = products.map((p) => ({
        id: String(p.productId),
        name: p.title,
        price: fmtKRW(Number(p.price)),
        image: p.imageUrl ? { uri: p.imageUrl } : { uri: TRANSPARENT_PX_URI },
      }));

      const mappedCategories =
        (categories ?? []).map((c) => ({
          name: c.name,
          image: c.imageUrl ? { uri: c.imageUrl } : { uri: TRANSPARENT_PX_URI },
        })).slice(0, 4); 

      return { products: mappedProducts, categories: mappedCategories };
    },

  
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    retry: 1,
  });
}
