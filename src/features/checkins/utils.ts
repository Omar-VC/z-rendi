import type { Checkin, MotivoNo } from "./types";

// Fecha local (no UTC) para que de noche en Argentina no cambie de día
export function fechaHoyISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export const ZONAS_MOLESTIA = [
  "Cuello",
  "Hombro",
  "Espalda",
  "Cadera / ingle",
  "Cuádriceps",
  "Isquios",
  "Rodilla",
  "Tobillo",
  "Otra",
];

export const MOTIVOS_NO: Record<MotivoNo, string> = {
  salud: "Salud / lesión",
  trabajo_estudio: "Trabajo / estudio",
  otro: "Otro",
};

export type Semaforo = {
  variant: "success" | "warning" | "danger" | "neutral";
  texto: string;
};

// Reglas iniciales (ajustables)
export function calcularSemaforo(c: Checkin): Semaforo {
  if (c.asiste === "no") return { variant: "neutral", texto: "No viene" };
  if (c.sueno == null || c.fatiga == null) {
    return { variant: "neutral", texto: "Sin datos" };
  }

  if (
    c.molestia?.nivel === "fuerte" ||
    (c.sueno <= 2 && c.fatiga <= 2)
  ) {
    return { variant: "danger", texto: "Cuidado" };
  }

  if (c.molestia?.nivel === "leve" || c.sueno <= 2 || c.fatiga <= 2) {
    return { variant: "warning", texto: "Atención" };
  }

  return { variant: "success", texto: "Bien" };
}