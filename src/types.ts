export type Ficha = {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  peso: number;
  altura: number;
  posicion: string;
  lesiones: string;
  evaluacionInicial: string;
  evaluacionActual: string;
};

export type SesionTipo = "fuerza" | "resistencia" | "tecnica" | "recuperacion";

export type Sesion = {
  id: string;
  tipo: SesionTipo;
  fecha: string;
  atleta: string;
  ejercicios: string;
  cargas: string;
  observaciones: string;
};

export type CuotaEstado = "pagado" | "pendiente";

export type Cuota = {
  id: string;
  atleta: string;
  estado: CuotaEstado;
  fechaVencimiento: string;
  monto: number;
  ultimoPago?: string;
};
