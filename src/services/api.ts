import axios, { type AxiosInstance } from "axios";
import router from "@/router";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

let _csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  _csrfToken = token;
}

api.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();
  const isSafe = method === "get" || method === "head" || method === "options";

  if (!isSafe && _csrfToken) {
    config.headers.set("X-CSRF-Token", _csrfToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setCsrfToken(null);

      if (router.currentRoute.value.name !== "login") {
        router.push({
          name: "login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
