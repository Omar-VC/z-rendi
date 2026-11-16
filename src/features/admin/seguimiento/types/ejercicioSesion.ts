export interface EjercicioSesion {
  ejercicioId: string;
  nombre: string;

  repeticiones?: string;
  pausa?: string;
  indicaciones?: string;

  seriesObjetivo?: number;
  repsObjetivo?: number;
  pesoSugerido?: number;
}
