import { api } from "../api";

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  //verificationCode: string;
  nickname: string;
  agreeMarketing: boolean;
  agreeThirdParty: boolean;
}

export const signUp = (data: SignUpRequest) => {
  return api.post("/user/auth/signup", data);
};
