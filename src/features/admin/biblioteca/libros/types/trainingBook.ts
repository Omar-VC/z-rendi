export type GrupoMuscular =
  | "Cuádriceps"
  | "Isquiosurales"
  | "Glúteos"
  | "Bíceps"
  | "Tríceps"
  | "Pectoral"
  | "Espalda"
  | "Hombros"
  | "Abdominales"
  | "Pantorrillas"
  | "Otro";

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

  gruposMusculares: GrupoMuscular[];

  observaciones?: string;

  createdAt?: Date;

  updatedAt?: Date;
}