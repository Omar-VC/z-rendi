export interface FichaCliente {
  id: string;

  clienteId: string;

  nombre?: string;
  apellido?: string;

  edad?: number;

  telefono?: string;

  peso?: number;
  altura?: number;

  deporte?: string;

  puesto?: string;

  nivel?: string;

  experiencia?: string;

  objetivoPrincipal?: string;

  objetivosSecundarios?: string[];

  lesiones?: string;

  observaciones?: string;

  createdAt?: string;
  updatedAt?: string;
}