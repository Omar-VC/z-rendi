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

  fotoUrl?: string; // 👈 Agregado para soportar la imagen de Cloudinary

  createdAt?: string;
  updatedAt?: string;
}