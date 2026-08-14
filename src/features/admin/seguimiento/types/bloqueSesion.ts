import type { EjercicioSesion } from "./ejercicioSesion";

export interface BloqueSesion {
  id: string;

  nombre: string;

  duracion: number;

  ejercicios: EjercicioSesion[];
}