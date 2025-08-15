import { api } from "../api";

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
}