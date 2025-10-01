import { api } from "../api";
import axios from 'axios';

export type ApiResponse<T = unknown> = {code: number; message:string; data?:T};

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

export async function getPresignedUrlForProfileImage(): Promise<PresignedUrlResponse> {
  const res = await api.get<ApiResponse<PresignedUrlResponse>>(
    `/profile/edit/presigned`,
    {
      params: {
        contentType: 'image/jpeg', 
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
  contentType: string = 'image/jpeg'
): Promise<void> {
  const response = await fetch(localImageUri);
  const blob = await response.blob();

  // S3에 직접 PUT 요청
  await axios.put(presignedUrl, blob, {
    headers: {
      'Content-Type': contentType,
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
  const res = await api.get<ApiResponse<ProductApiItem[]>>("/profile/trade/sell");
  const itemList = res.data.data ?? [];

  return itemList;
}

// 마이페이지 구매 내역 조회
export async function getMyPurchasedItem(): Promise<ProductApiItem[]> {
  const res = await api.get<ApiResponse<ProductApiItem[]>>("/profile/trade/buy");
  const itemList = res.data.data ?? [];

  return itemList;
}