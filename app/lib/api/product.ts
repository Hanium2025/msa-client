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
  name: string;     // 예: "IT, 전자제품"
  imageUrl: string; // S3 URL
};

export type HomeApiData = {
  products: HomeApiProduct[];
  categories?: HomeApiCategory[]; // 백엔드가 보낼 수도, 안 보낼 수도
  memberId?: number;              // 백엔드가 보낼 수도, 안 보낼 수도
};

export type HomeApiResponse = {
  code: number;
  message: string; // "메인페이지가 조회되었습니다 - 회원 ID: 1" 같은 메시지일 수 있음
  data: HomeApiData;
};

export async function fetchHomeApi(token?: string): Promise<HomeApiData> {
  const { data } = await api.get<HomeApiResponse>("/product", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (data.code !== 200) {
    throw new Error(data.message || "홈 데이터를 불러오지 못했습니다.");
  }
  return data.data; // { products, categories?, memberId? }
}

// 상품 좋아요/취소 토글
export type ToggleLikeResponse = {
  code: number;
  message: string; // "상품 (id=2) 찜이 등록되었습니다." | "상품 (id=2) 찜이 취소되었습니다."
};

export async function toggleProductLike(productId: number, token: string): Promise<ToggleLikeResponse> {
  const res = await api.post(
    `/product/like/${productId}`,
    {}, // 바디 없음
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data as ToggleLikeResponse;
}