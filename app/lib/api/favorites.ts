// app/api/favorites.ts
import { api } from "../api";

export type FavoriteApiItem = {
  productId: number;
  title: string;
  price: number;
  imageUrl: string | null;
};

export type FavoriteItem = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  liked: boolean;
};

export async function fetchFavorites(page = 0): Promise<FavoriteItem[]> {
  const res = await api.get("/product/like", {
    params: page ? { page } : undefined,
  });

  const list: FavoriteApiItem[] = res.data?.data ?? [];

  return list.map((it) => ({
    id: it.productId,
    title: it.title,
    price: it.price,
    imageUrl: it.imageUrl ?? undefined,
    liked: true,
  }));
}

export async function toggleFavorite(productId: number, token: string): Promise<void> {
  await api.post(`/product/like/${productId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}