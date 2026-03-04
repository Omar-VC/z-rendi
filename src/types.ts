export type Ficha = {
  id: string;
  clienteId?: string;
  nombre: string;
  apellido: string;
  edad: number;
  peso: number;
  altura: number;
  lesiones: string;
  deporte?: string;
  puesto?: string;
  telefono?: string;
  evaluacionInicial?: string;
  evaluacionActual?: string;
};

export type SesionEstado = "pendiente" | "completada";

export type Sesion = {
  id: string;
  clienteId: string;
  fecha: string;
  duracionEstimada: string;
  bloques: string;
  estado?: SesionEstado;
  completadaAt?: string;
};


export type CuotaEstado = "pagada" | "pendiente";

export type Cuota = {
  id: string;
  clienteId: string;
  mes: string;
  estado: CuotaEstado;
  fechaVencimiento: string;
  monto: number;
  ultimoPago?: string;
};
