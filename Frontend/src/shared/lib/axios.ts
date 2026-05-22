import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import env from "@/config/env";
import { AUTH_TOKEN_KEY, AUTH_REFRESH_KEY } from "@/config/constants";

export const api = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error || !token) {
      reject(error);
    } else {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      resolve(api(config));
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem(AUTH_REFRESH_KEY);
    if (!refresh) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ access: string }>(
        `${env.API_URL}/auth/token/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } },
      );

      const newToken = data.access;
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      }

      processQueue(null, newToken);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_KEY);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
