import axios, { type AxiosError, type AxiosInstance } from "axios";
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

export function onResponseError(error: AxiosError): Promise<never> {
  const isSessionProbe = error.config?.url?.includes("/auth/me");

  if (error.response?.status === 401 && !isSessionProbe) {
    setCsrfToken(null);

    if (router.currentRoute.value.name !== "login") {
      router.push({
        name: "login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }
  }

  return Promise.reject(error);
}

api.interceptors.response.use((response) => response, onResponseError);

export default api;
