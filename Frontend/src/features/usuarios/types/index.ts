export type Rol = "admin" | "reclutador" | "entrevistador" | "evaluador";
export type EstadoUsuario = "activo" | "inactivo";

export type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: Rol;
  estado: EstadoUsuario;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

export type CreateUsuarioDto = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: Rol;
};

export type UpdateUsuarioDto = Partial<Omit<CreateUsuarioDto, "password">> & {
  estado?: EstadoUsuario;
};
