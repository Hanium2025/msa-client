// hooks/useMyPage.ts
import { useCallback, useEffect, useState } from "react";
import {
  fetchMyProfile,
  updateAgreements,
  updateThirdPartyAgreements,
  //deleteAccount as deleteAccountApi,
  type MyProfile,
} from "../lib/api/user";
import { tokenStore } from "../auth/tokenStore";
import { api } from "../lib/api";

type UseMyPage = {
  profile: MyProfile | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  deleting: boolean;

  // 동작
  refresh: () => Promise<void>;
  setMarketingAgree: (v: boolean) => Promise<void>;
  setThirdPartyAgree: (v: boolean) => Promise<void>;

  changingMarketing?: boolean;
  changingThird?: boolean;

  // 선택: 회원 탈퇴 (라우팅은 화면에서)
  deleteAccount: () => Promise<void>;
};

export function useMyPage(): UseMyPage {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changingMarketing, setChangingMarketing] = useState(false);
  const [changingThird, setChangingThird] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const p = await fetchMyProfile();
      setProfile(p);
    } catch (e: any) {
      setError(e?.message ?? "프로필을 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  // 마케팅 동의 토글
  const setMarketingAgree = useCallback(
    async (v: boolean) => {
      if (changingMarketing) return;
      setChangingMarketing(true);

      setProfile((prev) => (prev ? { ...prev, agreeMarketing: v } : prev));

      try {
        // 1) 서버가 '토글'만 받는 경우 (바디 없이)
        await updateAgreements();
      } catch {
        try {
          // 2) 서버가 '값'을 요구하는 경우 (명시 값 전달)
          await updateAgreements({ agreeMarketing: v });
        } catch (e) {
          // 3) 완전 실패 → 롤백
          setProfile((prev) => (prev ? { ...prev, agreeMarketing: !v } : prev));
          throw e;
        }
      } finally {
        setChangingMarketing(false);
      }
      // 성공 시 즉시 상태 유지 (refresh로 다시 덮어쓰지 않음)
    },
    [changingMarketing]
  );

  // 제3자 동의 토글
  const setThirdPartyAgree = useCallback(
    async (v: boolean) => {
      if (changingThird) return;
      setChangingThird(true);

      setProfile((prev) => (prev ? { ...prev, agree3rdParty: v } : prev));

      try {
        await updateThirdPartyAgreements();
      } catch {
        try {
          await updateThirdPartyAgreements({ agree3rdParty: v });
        } catch (e) {
          setProfile((prev) => (prev ? { ...prev, agree3rdParty: !v } : prev));
          throw e;
        }
      } finally {
        setChangingThird(false);
      }
    },
    [changingThird]
  );

  // (선택) 회원 탈퇴
  const deleteAccount = useCallback(async () => {
    setDeleting(true);
    try {
      // 백엔드 경로를 열어두셨다면 주석 해제해서 사용하세요.
      // await deleteAccountApi();

      // 서버에서 쿠키/세션 정리 후, 클라이언트 토큰도 정리
      await tokenStore.clear?.();
      delete api.defaults.headers.common.Authorization;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    refreshing,
    deleting,
    refresh,
    setMarketingAgree,
    setThirdPartyAgree,
    deleteAccount,
    changingMarketing,
    changingThird,
  };
}
