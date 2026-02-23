import axios, { type AxiosInstance, AxiosHeaders } from "axios";
import router from "@/router";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      if (router.currentRoute.value.name !== "login") {
        router.push({
          name: "login",
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
