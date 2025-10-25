// app/hooks/useOtherProfile.ts
import { useQuery } from "@tanstack/react-query";
import { getOtherProfile, OtherProfile } from "../lib/api/profile";

export function useOtherProfile(memberId?: number, token?: string | null) {
  return useQuery<OtherProfile, Error>({
    queryKey: ["other-profile", memberId],
    queryFn: () => getOtherProfile(memberId!),
    enabled: !!memberId && !!token, // 둘 다 있어야 요청
    retry: 0,
  });
}
