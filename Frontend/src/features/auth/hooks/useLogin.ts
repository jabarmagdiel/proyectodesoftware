import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import type { ApiError } from "@/shared/types/api";
import { authService } from "../authService";
import type { LoginRequest } from "../types";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation<void, AxiosError<ApiError>, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
  });
}
