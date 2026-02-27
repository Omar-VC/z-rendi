export type Ficha = {
  id: string;
  clienteId?: string;
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
  clienteId: string;
  fecha: string;            // 🔑 un solo campo para fecha
  duracionEstimada: string; // 🔑 un solo campo para duración
  bloques: string;          // 🔑 textarea con descripción rápida
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
