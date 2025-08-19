import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenStore } from "../auth/tokenStore";
import {
  updateProduct,   
  RNFile,
} from "../lib/api/product";


export type CategoryValue =
  | "ELECTRONICS"
  | "FURNITURE"
  | "CLOTHES"
  | "BOOK"
  | "BEAUTY"
  | "FOOD"
  | "ETC";

export type UpdateProductPayload = {
  productId: number;
  title: string;
  content: string;
  price: number;                  
  category: CategoryValue;        
  leftImageIds: number[];
  newImages: Array<File | RNFile>;
};

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (p: UpdateProductPayload) => {
      const token = await tokenStore.get();
      if (!token) throw new Error("로그인이 필요합니다.");

      return updateProduct({
        productId: p.productId,
        json: {
          title: p.title.trim(),
          content: p.content.trim(),
          price: Math.trunc(p.price),
          category: p.category,
          leftImageIds: p.leftImageIds ?? [],
        },
        newImages: p.newImages ?? [],
        token,
      });
    },

    onSuccess: (_res, vars) => {
      // 상세 캐시 무효화
      qc.invalidateQueries({ queryKey: ["productDetail", vars.productId], exact: false });

      // 목록 캐시가 있다면 함께 무효화
      qc.invalidateQueries({ queryKey: ["productList"], exact: false });

      qc.setQueryData(["productDetail", vars.productId], (old: any) =>
        old
          ? { ...old, title: vars.title, content: vars.content, price: vars.price, category: vars.category }
          : old
      );
    },
  });
  
}
