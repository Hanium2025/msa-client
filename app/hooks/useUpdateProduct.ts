import { useMutation } from "@tanstack/react-query";
import { tokenStore } from "../auth/tokenStore";
import {
  updateProduct,
  UpdateProductJson,     
  RNFile,
  // ProductDTO 같은 반환 타입이 있다면 함께 import
} from "../lib/api/product";

// 서버 enum에 맞춰 제한
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
  price: number;                  // 서버 DTO(Long)과 동일
  category: CategoryValue;        // enum으로 제한
  leftImageIds: number[];
  newImages: Array<File | RNFile>;
};

export function useUpdateProduct() {
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
  });
}
