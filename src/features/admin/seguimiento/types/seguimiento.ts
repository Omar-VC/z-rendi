export interface SesionEntrenamiento {
  id: string;

  clienteId: string;

  preparadorId: string;

  fecha: Date;

  libroId: string;

  libroNombre: string;

  duracion: number;

  rpe: number;

  carga: number;

  observaciones?: string;

  createdAt?: Date;

  updatedAt?: Date;
}