export type EstadoCliente = "pendiente" | "aprobado";

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: EstadoCliente;
  rol: "cliente";
  createdAt: string;

  frecuenciaSemanal?: number;
}