export interface TrainingBook {
  id: string;

  preparadorId: string;

  nombre: string;

  categoria:
    | "Fuerza"
    | "Potencia"
    | "Velocidad"
    | "Resistencia"
    | "Prevención";

  ejercicios: string[];

  observaciones?: string;

  createdAt?: Date;

  updatedAt?: Date;
}