export type Rol = "admin" | "reclutador" | "entrevistador" | "evaluador";
export type EstadoUsuario = "activo" | "inactivo";

export type User = {
  id: number;
  username: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};
