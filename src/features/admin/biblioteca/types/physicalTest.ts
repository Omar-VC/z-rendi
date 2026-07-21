export type CategoriaPrueba =
  | "Fuerza"
  | "Potencia"
  | "Velocidad"
  | "Resistencia"
  | "Movilidad";

export interface PhysicalTest {

  id:string;

  preparadorId:string;

  nombre:string;

  categoria:CategoriaPrueba;

  unidad?:string;

  createdAt?:any;

  updatedAt?:any;
}