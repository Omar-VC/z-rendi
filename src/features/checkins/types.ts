export type Asiste = "si" | "no" | "tal_vez";
export type MotivoNo = "salud" | "trabajo_estudio" | "otro";
export type NivelMolestia = "leve" | "fuerte";

export interface Checkin {
  id: string;
  clienteId: string;
  preparadorId: string;
  fecha: string; // YYYY-MM-DD (hora local)
  asiste: Asiste;
  motivoNo?: MotivoNo;
  sueno?: number; // 1 a 5 (5 = mejor)
  fatiga?: number; // 1 a 5 (5 = mejor, cuerpo fresco)
  molestia?: { nivel: NivelMolestia; zonas: string[] };
  comentario?: string;
  actualizadoEn?: Date;
}

export type DatosCheckin = Omit<
  Checkin,
  "id" | "clienteId" | "preparadorId" | "fecha" | "actualizadoEn"
>;