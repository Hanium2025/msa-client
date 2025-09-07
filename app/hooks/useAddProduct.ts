import { useMutation } from '@tanstack/react-query';
import { registerProduct } from '../lib/api/product';

// useAddProduct.ts
export const useAddProduct = () => {
  return useMutation({
    mutationFn: ({ formData, token }: { formData: FormData; token: string }) =>
      registerProduct(formData, token),
  });
};