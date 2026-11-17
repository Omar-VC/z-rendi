export type TipoAviso =
  | "recordatorio"
  | "recomendacion"
  | "correccion"
  | "advertencia";

export interface Aviso {
  id: string;
  clienteId: string;
  preparadorId: string;
  tipo: TipoAviso;
  texto: string;
  leido: boolean;
  creadoEn: Date;
  leidoEn?: Date;
}

export const TIPOS_AVISO: Record<
  TipoAviso,
  { label: string; icono: string; clases: string }
> = {
  recordatorio: {
    label: "Recordatorio",
    icono: "🔔",
    clases: "border-info/40 bg-info/10 text-info",
  },
  recomendacion: {
    label: "Recomendación",
    icono: "💡",
    clases: "border-success/40 bg-success/10 text-success",
  },
  correccion: {
    label: "Corrección",
    icono: "🛠️",
    clases: "border-warning/40 bg-warning/10 text-warning",
  },
  advertencia: {
    label: "Advertencia",
    icono: "⚠️",
    clases: "border-danger/40 bg-danger/10 text-danger",
  },
};