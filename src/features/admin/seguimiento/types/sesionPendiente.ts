import type { BloqueSesion } from "./bloqueSesion";
import type { GrupoMuscular } from "../../biblioteca/tipo-sesion/types/trainingBook";

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

  gruposMusculares: GrupoMuscular[];

  bloques: BloqueSesion[];

  objetivo: string;

  observacionesPreparador?: string;

  // Datos que completa el cliente al finalizar
  duracion?: number;
  rpe?: number;
  carga?: number;
  observacionesCliente?: string;

  createdAt: Date;
}