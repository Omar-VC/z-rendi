import type { Cuota, Ficha, Sesion } from "../types";

export const fichasIniciales: Ficha[] = [
  {
    id: "f1",
    nombre: "Juan",
    apellido: "Pérez",
    edad: 20,
    peso: 75,
    altura: 180,
    posicion: "Delantero",
    lesiones: "Esguince de tobillo (2024)",
    evaluacionInicial: "Salto vertical 52cm - Sprint 30m 4.45s",
    evaluacionActual: "Salto vertical 57cm - Sprint 30m 4.33s",
  },
  {
    id: "f2",
    nombre: "María",
    apellido: "Gómez",
    edad: 22,
    peso: 65,
    altura: 170,
    posicion: "Mediocampo",
    lesiones: "Sin lesiones recientes",
    evaluacionInicial: "Yo-Yo test nivel 13",
    evaluacionActual: "Yo-Yo test nivel 15",
  },
];

export const sesionesIniciales: Sesion[] = [
  {
    id: "s1",
    tipo: "fuerza",
    fecha: "2026-02-10",
    atleta: "Juan Pérez",
    ejercicios: "Sentadilla, press banca, dominadas",
    cargas: "4x6 (80%), 4x8 (70%), 4x8 (peso corporal)",
    observaciones: "Buena técnica general",
  },
  {
    id: "s2",
    tipo: "resistencia",
    fecha: "2026-02-09",
    atleta: "María Gómez",
    ejercicios: "Intervalos 4x4 + trote regenerativo",
    cargas: "4 bloques de 4 minutos al 90%",
    observaciones: "Terminó con buena recuperación",
  },
];

export const cuotasIniciales: Cuota[] = [
  {
    id: "c1",
    atleta: "Juan Pérez",
    estado: "pendiente",
    fechaVencimiento: "2026-02-15",
    monto: 35000,
  },
  {
    id: "c2",
    atleta: "María Gómez",
    estado: "pagado",
    fechaVencimiento: "2026-02-01",
    monto: 35000,
    ultimoPago: "2026-01-31",
  },
];
