// hooks/useToggleLike.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProductLike } from "../lib/api/product";

export function useToggleLike(productId: number, token: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await toggleProductLike(productId, token);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productDetail", productId] });
    },
  });
}