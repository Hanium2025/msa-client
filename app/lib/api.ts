import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000', // 실제 서버 주소로 변경
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // RefreshToken 받기 위함
});

export const setAccessToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
