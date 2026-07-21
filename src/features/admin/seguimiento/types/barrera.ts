export type EstadoBarrera =
  | "pendiente"
  | "superada";


export interface Barrera {

  id: string;

  clienteId: string;
  preparadorId: string;

  // Referencia a biblioteca de pruebas
  pruebaId?: string;

  nombre: string;

  categoria?: string;

  unidad?: string;

  objetivo: string;

  resultado?: string;

  estado: EstadoBarrera;

  observaciones?: string;

  historial?: HistorialBarrera[];

  createdAt?: any;
  updatedAt?: any;

}

export interface HistorialBarrera {
  fecha: string;

  objetivo: string;

  resultado: string;

  observaciones?: string;
}