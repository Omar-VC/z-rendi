import type { EjercicioRealizado } from "./registroEjercicio";

export interface SesionEntrenamiento {
  id: string;

  clienteId: string;
  preparadorId: string;

  fecha: Date;

  mes: number;
  anio: number;

  libroId: string;
  libroNombre: string;

  gruposMusculares?: string[];

  ejercicios?: string[];

  duracion: number;
  rpe: number;
  carga: number;

  observaciones?: string;

  createdAt?: Date;
  updatedAt?: Date;

  // Nuevo: snapshot de lo realmente realizado por el atleta
  bloquesRealizados?: EjercicioRealizado[];
  sesionPendienteId?: string;
  duracionPlanificada?: number;
}