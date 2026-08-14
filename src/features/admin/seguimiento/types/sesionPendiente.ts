import type { BloqueSesion } from "./bloqueSesion";

export type EstadoSesionPendiente =
  | "pendiente"
  | "completada";

export interface SesionPendiente {
  id: string;

  clienteId: string;
  preparadorId: string;

  fecha: Date;

  estado: EstadoSesionPendiente;

  libroId: string;
  libroNombre: string;

  // Estructura nueva de la sesión
  bloques: BloqueSesion[];

  // Lo mantenemos temporalmente por compatibilidad
  ejercicios: unknown[];

  objetivo: string;

  observacionesPreparador?: string;

  // Datos que completa el cliente al finalizar
  duracion?: number;
  rpe?: number;
  carga?: number;
  observacionesCliente?: string;

  createdAt: Date;
}