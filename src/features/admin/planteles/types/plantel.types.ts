export type Deporte = "futbol" | "rugby" | "voley" | "basquet" | "otro";

export type EstadoJugador = "disponible" | "diferenciado" | "baja";

export interface JugadorPlantel {
  id: string;
  nombre: string;
  apellido: string;
  posicion?: string;
  estado: EstadoJugador;
  notasMedicas?: string;
}

export interface Equipo {
  id: string;
  nombre: string; // ej: "Plantel Superior"
  deporte: Deporte;
  categoria?: string; // ej: "Primera / Reserva"
  jugadores: JugadorPlantel[];
  createdAt?: any;
}

export interface BloqueEjercicio {
  id: string;
  equipoId?: string; // Si es null, es global para todos tus equipos
  titulo: string; // ej: "Pliometría Baja + Aceleración"
  categoria: "entrada_en_calor" | "fuerza" | "velocidad" | "resistencia" | "prevencion";
  descripcion: string; // Ejercicios, series, pausas
}

export interface SesionDiaEquipo {
  id: string;
  equipoId: string;
  fecha: string; // YYYY-MM-DD
  matchDayTag?: "MD-4" | "MD-3" | "MD-2" | "MD-1" | "MD" | "MD+1" | "MD+2";
  orientacion: string; // ej: "Fuerza / Potencia + Aceleración"
  duracionMinutos: number;
  bloques: BloqueEjercicio[];
  notasPF?: string;
  completada: boolean;
}

export interface PlanMesocicloEquipo {
  id: string;
  equipoId: string;
  mes: string;
  objetivoPrincipal: string; // ej: "Desarrollo VAM y Transferencia de Potencia"
  orientacionSemanas: {
    semana: number;
    enfoque: string;
  }[];
}