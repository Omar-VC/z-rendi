export interface SerieRealizada {
  reps: number;
  peso: number;
}

export interface EjercicioRealizado {
  ejercicioId: string;
  nombre: string;
  series: SerieRealizada[];
  observaciones?: string;
}

export interface RegistroEjercicio {
  id: string;
  clienteId: string;
  ejercicioId: string;
  nombre: string;
  fecha: Date;
  sesionId: string;
  preparadorId: string;
  series: SerieRealizada[];
  mejorPeso: number;
  volumen: number;
  e1RM: number;
}