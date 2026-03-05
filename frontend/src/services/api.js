import axios from "axios";

export const api = axios.create({
  // usa o proxy do Vite: /api -> http://api:8000
  baseURL: "",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});