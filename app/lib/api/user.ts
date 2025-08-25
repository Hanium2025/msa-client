import { api } from "../api";
import { setAccessToken } from "../api";
import { tokenStore } from "../../auth/tokenStore";

// 회원가입
export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  nickname: string;
  agreeMarketing: boolean;
  agreeThirdParty: boolean;
}

export const signUp = (data: SignUpRequest) => {
  return api.post("/user/auth/signup", data);
};

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccess {
  email: string;
  accessToken: string;
}

export const login = async (data: LoginRequest): Promise<LoginSuccess> => {
  const res = await api.post("/user/auth/login", data);

  const bodyToken: string | undefined = res?.data?.data?.accessToken;

  const headerToken: string | undefined = res?.headers?.authorization?.replace(
    /^Bearer\s+/i,
    ""
  );

  const accessToken = bodyToken ?? headerToken;

  if (!accessToken) {
    throw new Error("로그인 응답에서 accessToken을 찾을 수 없습니다.");
  }

  return {
    email: res.data.data?.email,
    accessToken,
  };
};

// 인증번호 발송
export interface SendSmsRequest {
  phoneNumber: string;
}

export interface ApiMessage {
  code: number;
  message: string;
}

/** 하이픈/공백 제거 후 발송 */
export const sendSmsCode = async (phoneNumber: string): Promise<ApiMessage> => {
  const body: SendSmsRequest = {
    phoneNumber: phoneNumber.replace(/[^0-9]/g, ""),
  };
  const res = await api.post("/user/sms/send", body);
  // 기대 응답: { code:200, message:"메시지 발송 완료" }
  return res.data as ApiMessage;
};

// 인증번호 검증
export interface VerifySmsRequest {
  phoneNumber: string; // 하이픈 없이, 혹은 자동 정리
  smsCode: string;
}

export const verifySmsCode = async (
  params: VerifySmsRequest
): Promise<ApiMessage> => {
  const body = {
    phoneNumber: params.phoneNumber.replace(/[^0-9]/g, ""),
    smsCode: params.smsCode,
  };
  const res = await api.post("/user/sms/verify", body);
  // 기대 응답: { code:200, message:"인증번호 확인되었습니다." }
  return res.data as ApiMessage;
};

// 카카오 로그인 설정 값 요청
export interface KakaoLoginConfig {
  kakaoRedirectUri: String;
  kakaoClientId: String;
}
export const getKakaoConfig = async (): Promise<KakaoLoginConfig> => {
  const res = await api.get("/user/auth/kakao-config");
  return {
    kakaoRedirectUri: res.data.kakaoRedirectUri,
    kakaoClientId: res.data.kakaoClientId,
  };
};
// 카카오 로그인
export const kakaoLogin = async (code: String): Promise<LoginSuccess> => {
  const res = await api.get("/user/auth/kakao/redirect", {
    params: {
      code: code,
    },
  });
  return {
    email: res.data.data?.email,
    accessToken: res.data.data?.accessToken,
  };
};

// 네이버 로그인 설정 값 요청
export interface NaverLoginConfing {
  naverClientId: String;
  naverRedirectUri: String;
  state: String;
}
export const getNaverConfig = async (): Promise<NaverLoginConfing> => {
  const res = await api.get("/user/auth/naver-config");
  return {
    naverClientId: res.data.naverClientId,
    naverRedirectUri: res.data.naverRedirectUri,
    state: res.data.state,
  };
};
// 네이버 로그인
export const naverLogin = async (code: String): Promise<LoginSuccess> => {
  const res = await api.get("/user/auth/naver/redirect", {
    params: {
      code: code,
    },
  });
  return {
    email: res.data.data?.email,
    accessToken: res.data.data?.accessToken,
  };
};

// 토큰 저장
const saveAccessToken = async (token: string) => {
  await tokenStore.set(token);   // SecureStore / localStorage
  setAccessToken(token);         // axios 기본 헤더에 Authorization 세팅
};

export const refreshAccessToken = async (): Promise<string> => {
  // 서버는 RefreshToken을 쿠키로 받음(withCredentials: true 필요)
  const res = await api.post("/user/auth/refresh", null);

  const bodyToken: string | undefined = res?.data?.data?.accessToken;
  const headerTokenRaw: string | undefined = res?.headers?.authorization;
  const headerToken = headerTokenRaw?.replace(/^Bearer\s+/i, "");

  const newToken = bodyToken ?? headerToken;
  if (!newToken) {
    throw new Error("refresh 응답에서 accessToken을 찾을 수 없습니다.");
  }

  await saveAccessToken(newToken);
  return newToken;
};

export const logout = async () => {
  await tokenStore.clear();     // 저장된 토큰 제거
  setAccessToken(undefined);    // axios 기본헤더에서 제거
};