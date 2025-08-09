// hook/useProductDetail.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProductDetail = (productId: number, token: string) => {
  return useQuery({
    queryKey: ['productDetail', productId],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data; 
    },
    enabled: !!token,
  });
};
