import { api } from "@/shared/lib/axios";
import type { PaginatedResponse } from "@/shared/types/api";
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from "../types";

export const usuariosService = {
  getUsuarios: (page = 1): Promise<Usuario[]> =>
    api
      .get<PaginatedResponse<Usuario>>("/usuarios/usuarios/", { params: { page } })
      .then((r) => r.data.results),

  getUsuarioById: (id: number): Promise<Usuario> =>
    api.get<Usuario>(`/usuarios/usuarios/${id}/`).then((r) => r.data),

  createUsuario: (dto: CreateUsuarioDto): Promise<Usuario> =>
    api.post<Usuario>("/usuarios/usuarios/", dto).then((r) => r.data),

  updateUsuario: (id: number, dto: UpdateUsuarioDto): Promise<Usuario> =>
    api.put<Usuario>(`/usuarios/usuarios/${id}/`, dto).then((r) => r.data),

  patchUsuario: (id: number, dto: UpdateUsuarioDto): Promise<Usuario> =>
    api.patch<Usuario>(`/usuarios/usuarios/${id}/`, dto).then((r) => r.data),

  deleteUsuario: (id: number): Promise<void> =>
    api.delete(`/usuarios/usuarios/${id}/`).then(() => undefined),
};
