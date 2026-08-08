export type EstadoCliente = "pendiente" | "aprobado";

export type EstadoCuentaCliente = "activo" | "inactivo";

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;

  estado: EstadoCliente;
  estadoCuenta: EstadoCuentaCliente;

  rol: "cliente";
  createdAt: string;

  frecuenciaSemanal?: number;
}