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