export type EstadoInvitacion =
  | "pendiente"
  | "usada"
  | "expirada";

export interface Invitacion {
  id: string;

  token: string;

  preparadorId: string;

  estado: EstadoInvitacion;

  createdAt: string;

  usedAt?: string;

  clienteId?: string;
}