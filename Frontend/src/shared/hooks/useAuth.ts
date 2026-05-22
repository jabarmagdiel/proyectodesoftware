import { useQueryClient } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY } from "@/config/constants";
import type { AuthUser } from "@/shared/types/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isAuthenticated = Boolean(token);
  const user = queryClient.getQueryData<AuthUser>(["auth", "me"]) ?? null;

  return {
    isAuthenticated,
    isLoading: isAuthenticated && user === null,
    user,
  };
}
