export type SesionEstado = "pendiente" | "completada";

export type Sesion = {
  id: string;
  clienteId: string;
  fecha: string;
  duracionEstimada: string;
  bloques: string;
  estado?: SesionEstado;
  completadaAt?: string;
};