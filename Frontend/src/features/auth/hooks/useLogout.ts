import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "../authService";
import { queryClient } from "@/shared/lib/query-client";

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(() => {
    authService.logout();
    queryClient.clear();
    navigate({ to: "/login" });
  }, [navigate]);
}
