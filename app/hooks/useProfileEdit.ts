import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPresignedUrlForProfileImage, 
  uploadImageToS3, 
  updateProfile 
} from "../lib/api/profile";

// 뮤테이션 함수에 전달될 데이터 타입 정의
type ProfileUpdatePayload = {
  nickname: string;
  // 사용자가 새로 선택한 이미지의 로컬 URI (e.g., 'file://...')
  newLocalAvatarUri?: string; 
  // 기존 이미지 URL (새 이미지를 선택 안했을 때 사용)
  originalAvatarUrl?: string;
};

export function useProfileEdit() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    // 뮤테이션 로직
    mutationFn: async (payload: ProfileUpdatePayload) => {
      let finalImageUrl = payload.originalAvatarUrl ?? '';

      // 1. 사용자가 새 이미지를 선택했다면, S3에 업로드부터 진행
      if (payload.newLocalAvatarUri) {
        // 1-1. 우리 서버로부터 Presigned URL 발급받기
        const presignedData = await getPresignedUrlForProfileImage();
        
        // 1-2. 발급받은 URL로 S3에 이미지 파일 업로드
        await uploadImageToS3(presignedData.presignedUrl, payload.newLocalAvatarUri);

        // 1-3. 최종적으로 DB에 저장될 이미지 경로를 업데이트
        finalImageUrl = presignedData.actualImagePath;
      }

      // 2. 최종 닉네임과 이미지 경로를 우리 서버에 전송하여 프로필 정보 업데이트
      await updateProfile({
        nickname: payload.nickname,
        imageUrl: finalImageUrl,
      });
    },

    // 뮤테이션 성공 시
    onSuccess: () => {
      // 내 정보 관련 쿼리 캐시를 무효화시켜서 최신 정보로 다시 불러오게 함
      // 이렇게 하면 'useMyPage' 훅이 자동으로 최신 데이터를 re-fetch합니다.
      queryClient.invalidateQueries({ queryKey: ['myPage'] });
    },

    // 뮤테이션 실패 시
    onError: (error) => {
      // 실제 앱에서는 Toast 메시지나 Alert로 에러를 보여주는 것이 좋습니다.
      console.error("프로필 업데이트 실패:", error);
      alert(error.message || "프로필 업데이트 중 오류가 발생했습니다.");
    },
  });

  return { 
    updateProfile: mutate, // 이 함수를 UI에서 호출
    isUpdating: isPending, // 업데이트 중인지 여부 (로딩 상태)
  };
}