import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  WriteBatch,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";
import type { EjercicioRealizado, RegistroEjercicio } from "../types/registroEjercicio";

const REGISTROS_COLLECTION = "registrosEjercicio";

/**
 * Limpia lo que cargó el atleta:
 * - serie válida = reps > 0 y peso >= 0, ambos números finitos
 * - descarta ejercicios sin series válidas
 * - nunca deja campos undefined (Firestore los rechaza)
 */
export function normalizarEjerciciosRealizados(
  ejercicios: EjercicioRealizado[],
): EjercicioRealizado[] {
  const resultado: EjercicioRealizado[] = [];

  for (const ej of ejercicios) {
    const series = (ej.series ?? [])
      .filter(
        (s) =>
          Number.isFinite(s.reps) &&
          Number.isFinite(s.peso) &&
          s.reps > 0 &&
          s.peso >= 0,
      )
      .map((s) => ({ reps: s.reps, peso: s.peso }));

    if (series.length === 0) continue;

    const limpio: EjercicioRealizado = {
      ejercicioId: ej.ejercicioId,
      nombre: ej.nombre,
      series,
    };
    if (ej.observaciones) limpio.observaciones = ej.observaciones;

    resultado.push(limpio);
  }

  return resultado;
}

export function crearRegistrosEjercicio(
  batch: WriteBatch,
  sesionId: string,
  clienteId: string,
  preparadorId: string,
  ejerciciosRealizados: EjercicioRealizado[],
): void {
  normalizarEjerciciosRealizados(ejerciciosRealizados).forEach((ejercicio) => {
    const series = ejercicio.series;

    const mejorPeso = Math.max(...series.map((s) => s.peso));
    const volumen = series.reduce((acc, s) => acc + s.reps * s.peso, 0);

    const conPeso = series.filter((s) => s.peso > 0);
    const e1RM =
      conPeso.length > 0
        ? Math.max(...conPeso.map((s) => s.peso * (1 + s.reps / 30)))
        : 0;

    const ref = doc(collection(db, REGISTROS_COLLECTION));
    const registro: Omit<RegistroEjercicio, "id"> = {
      clienteId,
      ejercicioId: ejercicio.ejercicioId,
      nombre: ejercicio.nombre,
      fecha: new Date(),
      sesionId,
      preparadorId,
      series,
      mejorPeso,
      volumen,
      e1RM,
    };

    batch.set(ref, registro);
  });
}

export async function obtenerUltimoRegistroEjercicio(
  clienteId: string,
  ejercicioId: string,
): Promise<RegistroEjercicio | null> {
  const q = query(
    collection(db, REGISTROS_COLLECTION),
    where("clienteId", "==", clienteId),
    where("ejercicioId", "==", ejercicioId),
    orderBy("fecha", "desc"),
    limit(1),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    ...data,
    fecha: data.fecha?.toDate?.() ?? new Date(data.fecha),
  } as RegistroEjercicio;
}

/** Último registro de varios ejercicios a la vez (consultas en paralelo). */
export async function obtenerUltimosRegistros(
  clienteId: string,
  ejercicioIds: string[],
): Promise<Record<string, RegistroEjercicio>> {
  const unicos = [...new Set(ejercicioIds)];

  const registros = await Promise.all(
    unicos.map((id) =>
      obtenerUltimoRegistroEjercicio(clienteId, id).catch(() => null),
    ),
  );

  const mapa: Record<string, RegistroEjercicio> = {};
  registros.forEach((registro, i) => {
    if (registro) mapa[unicos[i]] = registro;
  });

  return mapa;
}