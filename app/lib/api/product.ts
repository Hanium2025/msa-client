import { api } from "../api";
import { Platform } from "react-native";

export type RNFile = { uri: string; name?: string; type?: string };

export type UpdateProductJson = {
  title: string;
  content: string;
  price: number;          // 서버 DTO: Long
  category: "ELECTRONICS" | "FURNITURE" | "CLOTHES" | "BOOK" | "BEAUTY" | "FOOD" | "ETC";
  leftImageIds: number[];
};


export const registerProduct = async (
  formData: FormData,
  token: string
) => {
  const response = await api.post(
    "/product",   // baseURL 자동으로 붙음
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const fetchProductDetail = async (productId: number, token: string) => {
  const response = await api.get(
    `/product/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};


//상품 수정
export async function updateProduct({
  productId,
  json,
  newImages,
  token,
}: {
  productId: number;
  json: UpdateProductJson;
  newImages: Array<File | RNFile>;  
  token: string;
}) {
  const fd = new FormData();

  // 수정: Blob 대신 "문자 파트"로 (등록과 동일하게)
  fd.append("json", JSON.stringify(json));

  // 새 이미지(있을 때만)
  if (newImages && newImages.length > 0) {
    newImages.forEach((img, idx) => {
      if (Platform.OS === "web") {
        const f = img as File;
        fd.append("images", f, f.name ?? `image_${idx}.jpg`);
      } else {
        const f = img as RNFile;
        fd.append("images", {
          uri: f.uri,
          name: f.name ?? `image_${idx}.jpg`,
          type: f.type ?? "image/jpeg",
        } as any);
      }
    });
  }

  const res = await api.put(`/product/${productId}`, fd, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: (data, headers) => {
      // boundary 자동 생성을 위해 수동 Content-Type 제거
      // @ts-ignore
      delete headers["Content-Type"];
      // @ts-ignore
      delete headers.common?.["Content-Type"];
      return data;
    },
  });

  return res.data; // { code, message, data }
}


// DELETE /product/{productId}
export async function deleteProduct(productId: number, token: string) {
  const res = await api.delete(`/product/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // 서버 응답 형식: { code, message, data? }
  return res.data;
}


