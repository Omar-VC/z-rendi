export type CategoriaPrueba =
  | "Fuerza"
  | "Potencia"
  | "Velocidad"
  | "Resistencia"
  | "Movilidad";

export type SubcategoriaPrueba =
  | "Superior"
  | "Inferior"
  | "General";

export interface PhysicalTest {
  id: string;

  preparadorId: string;

  nombre: string;

  categoria: CategoriaPrueba;

  subcategoria: SubcategoriaPrueba;

  unidad: string;

  createdAt?: any;
  updatedAt?: any;
}