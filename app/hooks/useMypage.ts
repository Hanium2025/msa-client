import { useCallback, useEffect, useState } from "react";
import {
  fetchMyProfile,
  updateAgreements,
  updateThirdPartyAgreements,
  // deleteAccount as deleteAccountApi,
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
  changingMarketing: boolean;
  changingThird: boolean;

  refresh: () => Promise<void>;
  setMarketingAgree: (v: boolean) => Promise<void>;
  setThirdPartyAgree: (v: boolean) => Promise<void>;
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

  /** 프로필 불러오기 */
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

  /** 마케팅 동의 변경 */
  const setMarketingAgree = useCallback(
    async (v: boolean) => {
      setProfile((prev) => (prev ? { ...prev, agreeMarketing: v } : prev));
      try {
        await updateAgreements({ agreeMarketing: v });
        await refresh(); // 서버 값으로 최종 동기화
      } catch (e) {
        setProfile((prev) => (prev ? { ...prev, agreeMarketing: !v } : prev));
        throw e;
      }
    },
    [refresh]
  );

  /** 제3자 동의 변경 */
  const setThirdPartyAgree = useCallback(
    async (v: boolean) => {
      setProfile((prev) => (prev ? { ...prev, agree3rdParty: v } : prev));
      try {
        await updateThirdPartyAgreements({ agree3rdParty: v });
        await refresh();
      } catch (e) {
        setProfile((prev) => (prev ? { ...prev, agree3rdParty: !v } : prev));
        throw e;
      }
    },
    [refresh]
  );

  /** 회원 탈퇴 */
  const deleteAccount = useCallback(async () => {
    setDeleting(true);
    try {
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
