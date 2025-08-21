// app/hooks/useDeleteProduct.ts
import { useMutation } from "@tanstack/react-query";
import { tokenStore } from "../auth/tokenStore";
import { deleteProduct as deleteProductApi } from "../lib/api/product";

export function useDeleteProduct() {
  return useMutation({

    mutationFn: async (productId: number) => {
      const token = await tokenStore.get();
      if (!token) throw new Error("로그인이 필요합니다.");
      return deleteProductApi(productId, token);
    },
  });
}
