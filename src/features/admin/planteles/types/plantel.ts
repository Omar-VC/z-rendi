export interface AtletaPlantel {
  id: string;
  nombre: string;
  apellido: string;
  posicion?: string;
  estado: "disponible" | "diferenciado" | "ausente";
  observaciones?: string;
}

export interface BloqueSesion {
  id?: string;
  titulo: string;
  categoria: 
    | "entrada_en_calor" 
    | "activacion" 
    | "fuerza" 
    | "resistencia" 
    | "tactico" 
    | "zona_media" 
    | "vuelta_a_la_calma";
  duracionMinutos: number;
  descripcion: string;
  ejercicios?: string[];
  orden: number; // <-- Asegúrate de que esté declarada aquí
}

export interface Equipo {
  id?: string;
  nombre: string; // ej: "Plantel Superior"
  deporte: string; // ej: "Fútbol", "Rugby", "Vóley"
  categoria?: string; // ej: "Primera", "M19"
  creadoEn?: any;
  atletasCount?: number;
  proximaSesion?: string;
}

export interface SesionEntrenamiento {
  id?: string;
  equipoId: string;
  preparadorId?: string;
  fecha: string; // Formato YYYY-MM-DD
  microciclo?: string; // ej: "Match Day -3", "Fuerza Máxima"
  duracionTotalMinutos: number;
  objetivo: string;
  bloques: BloqueSesion[];
  completada: boolean;
  creadoEn?: any;
}

export interface PlanificacionGeneral {
  id?: string;
  equipoId: string;
  mesocicloActual: string; // Ej: "Pretemporada - Bloque 1"
  objetivoMesociclo: string; // Ej: "Desarrollo de fuerza base e hipertrofia funcional"
  microcicloActual: string; // Ej: "Semana 2 (MD-3)"
  objetivoMicrociclo: string; // Ej: "Carga de volumen moderado + aceleraciones cortas"
  actualizadoEn?: any;
}