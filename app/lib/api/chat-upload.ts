import { api } from "../api";

export type PresignedUrlDTO = {
  uploadUrl: string; // S3 PUT
  fileUrl: string; // 조회 URL
  key?: string;
};

// 서버가 putUrl/getUrl로 보낼 수도, {data: [...]}로 래핑할 수도 있으니 정규화
function normalizePresignedArray(payload: any): PresignedUrlDTO[] {
  const arr = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return arr.map((it: any) => ({
    uploadUrl: it.uploadUrl ?? it.putUrl, // 양쪽 키 모두 대응
    fileUrl: it.fileUrl ?? it.getUrl,
    key: it.key,
  }));
}

export type CreatePresignedUrlsApiRequest = {
  chatroomId: number;
  count: number; // 1..3
  contentType: string; // image/jpeg | image/png | ...
};

export async function createPresignedUrls(
  req: CreatePresignedUrlsApiRequest,
  token: string
): Promise<PresignedUrlDTO[]> {
  const { data } = await api.post<ServerPresign[]>(
    "/chatroom/presigned-urls",
    req,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // 서버 → 클라 타입으로 매핑
  return data.map((i) => ({
    uploadUrl: i.putUrl,
    fileUrl: i.getUrl,
    key: i.key,
  }));
}

// 실제 S3 PUT (주의: Authorization 헤더 넣지 말 것!)
export async function putToS3(
  uploadUrl: string,
  file: Blob | File,
  contentType: string
): Promise<void> {
  const ct = contentType?.toLowerCase().startsWith("image/")
    ? contentType
    : "image/jpeg";

  const res = await fetch(uploadUrl, {
    method: "PUT",
    mode: "cors", // 👈 추가
    credentials: "omit", // 👈 추가 (쿠키 금지)
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`S3 PUT failed ${res.status}: ${text}`);
  }
}
