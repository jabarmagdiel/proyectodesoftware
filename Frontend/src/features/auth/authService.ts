import { api } from "@/shared/lib/axios";
import { AUTH_TOKEN_KEY, AUTH_REFRESH_KEY } from "@/config/constants";
import type { LoginRequest, User } from "./types";

export const authService = {
  login: async (data: LoginRequest): Promise<void> => {
    const response = await api.post<{ access: string; refresh: string }>(
      "/auth/token/",
      data,
    );
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.access);
    localStorage.setItem(AUTH_REFRESH_KEY, response.data.refresh);
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
  },

  me: async (): Promise<User> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error("No hay sesión activa");
    const payload = JSON.parse(atob(token.split(".")[1])) as {
      user_id: number;
      username: string;
    };
    return { id: payload.user_id, username: payload.username };
  },
};
