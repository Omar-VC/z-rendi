import type { Timestamp } from "firebase/firestore";

export type EstadoBarrera =
  | "pendiente"
  | "superada";


export interface Barrera {

  id: string;

  clienteId: string;
  preparadorId: string;

  // Referencia a biblioteca de pruebas
  pruebaId?: string;

  // Meta cuantitativa para automatizar barreras de fuerza.
  ejercicioId?: string;
  ejercicioNombre?: string;
  pesoObjetivo?: number;
  repeticionesObjetivo?: number;
  grupoProgresionId?: string;
  barreraAnteriorId?: string;
  barreraSiguienteId?: string;

  nombre: string;

  categoria?: string;

  subcategoria?: string;

  unidad?: string;

  objetivo: string;

  resultado?: string;

  estado: EstadoBarrera;

  observaciones?: string;

  historial?: HistorialBarrera[];

  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;

}

export interface HistorialBarrera {
  fecha: string;

  objetivo: string;

  resultado: string;

  observaciones?: string;
}
