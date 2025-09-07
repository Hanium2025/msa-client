import { api } from "../api";
import { Platform } from "react-native";

export type RNFile = { uri: string; name?: string; type?: string };

export type UpdateProductJson = {
  title: string;
  content: string;
  price: number;          
  category: "TRAVEL" | "FEEDING" | "SLEEP" | "PLAY" | "LIVING" | "APPAREL" | "OTHER";
  leftImageIds: number[];
};

export type RegisterCategory =
  | "TRAVEL" | "FEEDING" | "SLEEP" | "PLAY" | "LIVING" | "APPAREL" | "OTHER";

export type RegisterProductJson = {
  title: string;
  content: string;
  price: number;      
  category: RegisterCategory;
};

export function buildRegisterFormData(
  json: RegisterProductJson,
  images: Array<File | RNFile>
): FormData {
  if (!images?.length) {
    throw new Error("대표 이미지 1장은 필수입니다.");
  }
  if (images.length > 5) {
    throw new Error("이미지는 최대 5개까지 업로드 가능합니다.");
  }

  const fd = new FormData();
  fd.append("json", JSON.stringify(json) as any);

  images.forEach((img, idx) => {
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

  return fd;
}
//상품 등록
export const registerProduct = async (formData: FormData, token: string) => {
  const response = await api.post("/product", formData, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: (data, headers) => {
      delete headers["Content-Type"];
      delete headers.common?.["Content-Type"];
      return data;
    },
  });
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
const JSON_PART_NAME = "json";

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

  if (Platform.OS === "web") {
  fd.append(JSON_PART_NAME, JSON.stringify(json));
} else {
  fd.append(JSON_PART_NAME, JSON.stringify(json) as any);
}

  if (Array.isArray(newImages) && newImages.length > 0) {
    // 새 이미지들 추가
    newImages.forEach((img, idx) => {
      if (Platform.OS === "web") {
        const f = img as File;
        fd.append("images", f, f.name ?? `image_${idx}.jpg`);
      } else {
        const f = img as RNFile;
        fd.append(
          "images",
          { uri: f.uri, name: f.name ?? `image_${idx}.jpg`, type: f.type ?? "image/jpeg" } as any
        );
      }
    });
  } else {
    // 0개여도 images 키 포함
    if (Platform.OS === "web") {
      // 0바이트 빈 파일
      fd.append("images", new File([], ""));
    } else {
      // 0바이트 data URI로 빈 파일 파트
      fd.append(
        "images",
        {
          uri: "data:application/octet-stream;base64,", // 빈 데이터
          name: "empty",
          type: "application/octet-stream",
        } as any
      );
    }
  }

  const res = await api.put(`/product/${productId}`, fd, {
    headers: { Authorization: `Bearer ${token}` },
    transformRequest: (data, headers) => {
      delete headers["Content-Type"];
      delete headers.common?.["Content-Type"];
      return data;
    },
  });

  return res.data;
}


// DELETE /product/{productId}
export async function deleteProduct(productId: number, token: string) {
  const res = await api.delete(`/product/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}


// 메인 상품
export type HomeApiProduct = {
  productId: number;
  title: string;
  price: number;
  imageUrl: string; // 빈 문자열일 수 있음
};

export type HomeApiCategory = {
  name: string;     
  imageUrl: string; 
};

export type HomeApiData = {
  products: HomeApiProduct[];
  categories?: HomeApiCategory[]; 
  memberId?: number;              
};

export type HomeApiResponse = {
  code: number;
  message: string; 
  data: HomeApiData;
};

export async function fetchHomeApi(token?: string): Promise<HomeApiData> {
  const { data } = await api.get<HomeApiResponse>("/product", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (data.code !== 200) {
    throw new Error(data.message || "홈 데이터를 불러오지 못했습니다.");
  }
  return data.data; 
}

// 상품 좋아요/취소 토글
export type ToggleLikeResponse = {
  code: number;
  message: string; 
};

export async function toggleProductLike(productId: number, token: string): Promise<ToggleLikeResponse> {
  const res = await api.post(
    `/product/like/${productId}`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data as ToggleLikeResponse;
}