export type TipoPrueba = "teorica" | "tecnica" | "mixta";
export type AreaPrueba = "programacion" | "negocio" | "juridica";
export type NivelPrueba = "basico" | "intermedio" | "avanzado";
export type EstadoPrueba = "borrador" | "activa" | "inactiva" | "archivada";

export type Prueba = {
  id: number;
  titulo: string;
  descripcion: string;
  creada_por: number;
  tipo: TipoPrueba;
  area: AreaPrueba;
  nivel: NivelPrueba;
  duracion_minutos: number;
  puntaje_maximo: number;
  estado: EstadoPrueba;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

export type CreatePruebaDto = {
  titulo: string;
  descripcion: string;
  creada_por: number;
  tipo: TipoPrueba;
  area: AreaPrueba;
  nivel: NivelPrueba;
  duracion_minutos: number;
  puntaje_maximo: number;
  estado?: EstadoPrueba;
};

export type UpdatePruebaDto = Partial<Omit<CreatePruebaDto, "creada_por">>;
