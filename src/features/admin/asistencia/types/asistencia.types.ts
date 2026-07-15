export type EstadoAsistencia =
  | "presente"
  | "falta";


export interface Asistencia {
  id: string;
  clienteId: string;
  fecha: string;
  estado: EstadoAsistencia;
  frecuenciaSemanalMes: number;
  createdAt?: string;
}