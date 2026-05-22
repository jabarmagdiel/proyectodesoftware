import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosService } from "../services/usuariosService";
import type { CreateUsuarioDto, UpdateUsuarioDto } from "../types";

const BASE_KEY = ["usuarios"] as const;

export function useGetUsuarios(page = 1) {
  return useQuery({
    queryKey: [...BASE_KEY, page] as const,
    queryFn: () => usuariosService.getUsuarios(page),
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUsuarioDto) => usuariosService.createUsuario(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}

type UpdateVars = { id: number; dto: UpdateUsuarioDto };

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: UpdateVars) => usuariosService.updateUsuario(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosService.deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BASE_KEY });
    },
  });
}
