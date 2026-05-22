import { useQuery } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY, QUERY_STALE_TIME } from "@/config/constants";
import { authService } from "../authService";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"] as const,
    queryFn: authService.me,
    staleTime: QUERY_STALE_TIME,
    enabled: Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  });
}
