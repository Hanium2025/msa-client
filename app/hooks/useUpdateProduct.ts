// app/hooks/useUpdateProduct.ts
import { useMutation } from "@tanstack/react-query";
import { Platform } from "react-native";
import { api } from "../lib/api";
import { tokenStore } from "../auth/tokenStore";

export type UpdateProductPayload = {
  productId: number;
  title: string;
  content: string;
  price: number;
  category: string;          // 예: "FOOD" | "ELECTRONICS" ...
  leftImageIds: number[];    // 남길 기존 이미지 id
  newImages: Array<File | { uri: string; name?: string; type?: string }>;
};

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async (p: UpdateProductPayload) => {
      const token = await tokenStore.get();
      if (!token) throw new Error("로그인이 필요합니다.");

      const json = {
        title: p.title,
        content: p.content,
        price: p.price,
        category: p.category,
        leftImageIds: p.leftImageIds ?? [],
      };

      const fd = new FormData();
      fd.append("json", JSON.stringify(json));

      if (p.newImages && p.newImages.length > 0) {
        p.newImages.forEach((img, idx) => {
          if (Platform.OS === "web") {
            fd.append("images", img as File, (img as File).name);
          } else {
            const f = img as { uri: string; name?: string; type?: string };
            fd.append("images", {
              uri: f.uri,
              name: f.name ?? `image_${idx}.jpg`,
              type: f.type ?? "image/jpeg",
            } as any);
          }
        });
      } else {
        // 스펙: 0장이어도 images 키는 포함
        if (Platform.OS === "web") {
          fd.append("images", new Blob([], { type: "application/octet-stream" }) as any, "");
        } else {
          // 네이티브는 서버가 키 존재만 검사한다면 아래도 가능:
          // fd.append("images", "" as any);
        }
      }

      const res = await api.put(`/product/${p.productId}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 서버가 커스텀 헤더를 볼 수 있어 병행(임시)
          accessToken: token as any,
        },
      });
      return res.data; // { code, message, data: {...} }
    },
  });
}
