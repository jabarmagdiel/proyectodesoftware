import { api } from "@/shared/lib/axios";
import type { PaginatedResponse } from "@/shared/types/api";
import type { Prueba, CreatePruebaDto, UpdatePruebaDto } from "../types";

export const examsService = {
  getPruebas: (page = 1): Promise<Prueba[]> =>
    api
      .get<PaginatedResponse<Prueba>>("/pruebas/pruebas/", { params: { page } })
      .then((r) => r.data.results),

  getPruebaById: (id: number): Promise<Prueba> =>
    api.get<Prueba>(`/pruebas/pruebas/${id}/`).then((r) => r.data),

  createPrueba: (dto: CreatePruebaDto): Promise<Prueba> =>
    api.post<Prueba>("/pruebas/pruebas/", dto).then((r) => r.data),

  updatePrueba: (id: number, dto: UpdatePruebaDto): Promise<Prueba> =>
    api.put<Prueba>(`/pruebas/pruebas/${id}/`, dto).then((r) => r.data),

  patchPrueba: (id: number, dto: UpdatePruebaDto): Promise<Prueba> =>
    api.patch<Prueba>(`/pruebas/pruebas/${id}/`, dto).then((r) => r.data),

  deletePrueba: (id: number): Promise<void> =>
    api.delete(`/pruebas/pruebas/${id}/`).then(() => undefined),
};
