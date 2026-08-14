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

export interface Exercise {
  id: string;

  preparadorId: string;

  nombre: string;

  grupoMuscular: GrupoMuscular;

  descripcion?: string;

  videoUrl?: string;

  createdAt?: Date;

  updatedAt?: Date;
}