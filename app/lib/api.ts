import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // 실제 서버 주소로 변경
  headers: {
    "Content-Type": "application/json",
  },
});
