import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import type { PaginatedResponse } from "@/shared/types/api";

function fetchCount(url: string): Promise<number> {
  return api
    .get<PaginatedResponse<unknown>>(url, { params: { page: 1 } })
    .then((r) => r.data.count);
}

export function useDashboardStats() {
  const usuarios = useQuery({
    queryKey: ["dashboard", "usuarios"],
    queryFn: () => fetchCount("/usuarios/usuarios/"),
  });
  const pruebas = useQuery({
    queryKey: ["dashboard", "pruebas"],
    queryFn: () => fetchCount("/pruebas/pruebas/"),
  });
  const entrevistas = useQuery({
    queryKey: ["dashboard", "entrevistas"],
    queryFn: () => fetchCount("/entrevistas/entrevistas/"),
  });

  return {
    totalUsuarios: usuarios.data ?? 0,
    totalPruebas: pruebas.data ?? 0,
    totalEntrevistas: entrevistas.data ?? 0,
    isLoading: usuarios.isLoading || pruebas.isLoading || entrevistas.isLoading,
  };
}
