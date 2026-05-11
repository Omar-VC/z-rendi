export interface Planilla {
  id: string;
  nombre: string;
  fechaCreacion?: Date;
}

export type Atleta = {
  id?: string;
  nombre: string;
  apellido?: string | null;
  fechaNacimiento?: string | Date | null;
  altura?: number | null;
  peso?: number | null;
  deporte?: string | null;
  posicion?: string | null;
  lesiones?: string | null;
  creado?: string | Date;
  actualizado?: string | Date;
};

export type RegistroTipo = "diario" | "test" | "observacion";

export type Registro = {
  id?: string;
  atletaId: string;
  tipo: RegistroTipo;
  fecha: string | Date;
  estadoAnimo?: number | null;
  rpe?: number | null;
  duracion?: number | null;
  carga?: number | null;
  fuerzaPress?: number | null;
  fuerzaSentadillas?: number | null;
  saltoHorizontal?: number | null;
  velocidadDistancia?: number | null;
  velocidadTiempo?: number | null;
  resistenciaAerobica?: number | null;
  resistenciaAnaerobica?: number | null;
  broncoTest?: number | null;
  observaciones?: string | null;
  creado?: string | Date;
  actualizado?: string | Date;
};