import { api } from "../api";
import axios from "axios";

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

export type UpdateProfileRequest = {
  nickname: string;
  imageUrl: string;
};

export type UpdateProfileResponse = {
  nickname: string;
  imageUrl: string;
};

export type PresignedUrlResponse = {
  presignedUrl: string;
  actualImagePath: string;
};

export type ProductApiItem = {
  productId: number;
  title: string;
  price: number;
  imageUrl: string | null;
};

// 상대프로필 조회
export type OtherProfile = {
  memberId: number;
  nickname: string;
  imageUrl: string;
  score: number;
  mainCategory: string[];
  products: ProductApiItem[]; // 재사용
};

export async function getPresignedUrlForProfileImage(): Promise<PresignedUrlResponse> {
  const res = await api.get<ApiResponse<PresignedUrlResponse>>(
    `/profile/edit/presigned`,
    {
      params: {
        contentType: "image/jpeg",
      },
    }
  );
  if (res.data.code !== 200 || !res.data.data) {
    throw new Error(res.data.message || "Presigned URL 발급에 실패했습니다.");
  }
  return res.data.data;
}

export async function uploadImageToS3(
  presignedUrl: string,
  localImageUri: string,
  contentType: string = "image/jpeg"
): Promise<void> {
  const response = await fetch(localImageUri);
  const blob = await response.blob();

  // S3에 직접 PUT 요청
  await axios.put(presignedUrl, blob, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

export async function updateProfile(
  payload: UpdateProfileRequest
): Promise<ApiResponse<UpdateProfileResponse>> {
  const res = await api.put<ApiResponse<UpdateProfileResponse>>(
    `/profile/edit`,
    payload
  );
  return res.data;
}

// 마이페이지 판매 내역 조회
export async function getMySellItem(): Promise<ProductApiItem[]> {
  const res = await api.get<ApiResponse<ProductApiItem[]>>(
    "/profile/trade/sell"
  );
  const itemList = res.data.data ?? [];

  return itemList;
}

// 마이페이지 구매 내역 조회
export async function getMyPurchasedItem(): Promise<ProductApiItem[]> {
  const res =
    await api.get<ApiResponse<ProductApiItem[]>>("/profile/trade/buy");
  const itemList = res.data.data ?? [];

  return itemList;
}

// 상대프로필 조회
export async function getOtherProfile(memberId: number): Promise<OtherProfile> {
  try {
    const res = await api.get<ApiResponse<OtherProfile>>(
      `/profile/${memberId}`
    );

    if (res.data.code !== 200 || !res.data.data) {
      throw new Error(res.data.message || "프로필을 조회할 수 없습니다.");
    }

    // 응답 정규화 (이미지 공백 문자열 → null 등)
    const data = res.data.data;
    const products = (data.products ?? []).map((p) => ({
      productId: p.productId,
      title: p.title,
      price: p.price,
      imageUrl: p.imageUrl && p.imageUrl.trim().length > 0 ? p.imageUrl : null,
    }));

    return {
      memberId: data.memberId,
      nickname: data.nickname,
      imageUrl: data.imageUrl,
      score: data.score,
      mainCategory: data.mainCategory ?? [],
      products,
    };
  } catch (err: any) {
    // 서버 스펙: 내 프로필을 상대 API로 요청하면 400을 줄 수 있음
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "프로필을 조회할 수 없습니다.";

    const e: any = new Error(message);
    e.status = status;
    throw e;
  }
}
