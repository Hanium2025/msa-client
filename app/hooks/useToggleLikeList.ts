// hooks/useToggleLikeList.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProductLike } from "../lib/api/product";

export function useToggleLikeList(token: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (productId: number) => {
      return await toggleProductLike(productId, token);
    },
    onSuccess: (_, productId) => {
      qc.invalidateQueries({ queryKey: ["productDetail", productId] });
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
