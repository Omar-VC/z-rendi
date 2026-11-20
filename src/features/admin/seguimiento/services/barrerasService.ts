import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";
import type { Barrera } from "../types/barrera";
import { auth } from "../../../../firebase/firebase";

const COLLECTION = "barrerasProgreso";

export async function obtenerBarreras(clienteId: string): Promise<Barrera[]> {
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;

  // El atleta consulta lo suyo; el preparador consulta solo lo que él creó
  const q =
    uid && uid !== clienteId
      ? query(
          collection(db, COLLECTION),
          where("clienteId", "==", clienteId),
          where("preparadorId", "==", uid),
        )
      : query(collection(db, COLLECTION), where("clienteId", "==", clienteId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Barrera[];
}

export async function crearBarrera(barrera: Omit<Barrera, "id">) {
  await addDoc(collection(db, COLLECTION), {
    ...barrera,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function actualizarBarrera(id: string, cambios: Partial<Barrera>) {
  const ref = doc(db, COLLECTION, id);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("La barrera no existe");
  }

  const barrera = snapshot.data();

  const historialActual = barrera.historial || [];

  let historial = historialActual;

  if (cambios.resultado) {
    historial = [
      ...historialActual,
      {
        fecha: new Date().toISOString(),

        objetivo: barrera.objetivo,

        resultado: cambios.resultado,

        observaciones: cambios.observaciones ?? "",
      },
    ];
  }

  await updateDoc(ref, {
    ...cambios,

    historial,

    updatedAt: serverTimestamp(),
  });
}

export async function guardarNuevoObjetivo(
  id: string,
  objetivoNuevo: string,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);

  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("La barrera no existe");
  }

  const barrera = snapshot.data();

  const historialActual = barrera.historial || [];

  const nuevoRegistro = {
    fecha: new Date().toISOString(),

    objetivo: barrera.objetivo,

    resultado: barrera.resultado || "",

    observaciones: barrera.observaciones || "",
  };

  await updateDoc(ref, {
    objetivo: objetivoNuevo,

    resultado: "",

    observaciones: "",

    estado: "pendiente",

    historial: [...historialActual, nuevoRegistro],

    updatedAt: serverTimestamp(),
  });
}

export async function eliminarBarrera(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

function formatearPeso(peso: number): string {
  return Number.isInteger(peso) ? String(peso) : peso.toFixed(1);
}

function obtenerMejorSerieQueCumple(
  ejercicio: { series?: Array<{ peso: number; reps: number }> },
  pesoObjetivo: number,
  repeticionesObjetivo: number,
) {
  return (ejercicio.series ?? [])
    .filter(
      (serie) =>
        Number.isFinite(serie.peso) &&
        Number.isFinite(serie.reps) &&
        serie.peso >= pesoObjetivo &&
        serie.reps >= repeticionesObjetivo,
    )
    .sort((a, b) => b.peso - a.peso || b.reps - a.reps)[0];
}

/**
 * Procesa una sesión completada desde el panel del preparador, sin Cloud Functions.
 * El identificador de la nueva barrera es determinista para evitar duplicados
 * si más de una pestaña procesa la misma sesión.
 */
export async function procesarBarrerasFuerzaDeSesion(
  sesionId: string,
  sesion: {
    clienteId: string;
    preparadorId: string;
    barrerasFuerzaProcesadas?: boolean;
    fecha?: Date;
    bloquesRealizados?: Array<{
      ejercicioId: string;
      series: Array<{ peso: number; reps: number }>;
    }>;
  },
): Promise<void> {
  if (sesion.barrerasFuerzaProcesadas || !sesion.clienteId || !sesion.preparadorId) return;

  const ejercicios = new Map(
    (sesion.bloquesRealizados ?? []).map((ejercicio) => [ejercicio.ejercicioId, ejercicio]),
  );
  const barreras = await obtenerBarreras(sesion.clienteId);
  const fecha = sesion.fecha ?? new Date();
  const fechaIso = fecha.toISOString();
  const batch = writeBatch(db);
  let cambios = 1;

  for (const barrera of barreras) {
    if (
      barrera.preparadorId !== sesion.preparadorId ||
      barrera.estado !== "pendiente" ||
      barrera.categoria !== "Fuerza" ||
      !barrera.ejercicioId ||
      !Number.isFinite(barrera.pesoObjetivo) ||
      !Number.isFinite(barrera.repeticionesObjetivo)
    ) continue;

    const ejercicio = ejercicios.get(barrera.ejercicioId);
    if (!ejercicio) continue;

    const marca = obtenerMejorSerieQueCumple(
      ejercicio,
      barrera.pesoObjetivo!,
      barrera.repeticionesObjetivo!,
    );
    if (!marca) continue;

    const resultado = `${formatearPeso(marca.peso)} kg × ${marca.reps} repeticiones`;
    const entradaHistorial = {
      fecha: fechaIso,
      objetivo: barrera.objetivo,
      resultado,
      observaciones: "Objetivo alcanzado al registrar la sesión.",
    };
    batch.update(doc(db, COLLECTION, barrera.id), {
      estado: "superada",
      resultado,
      observaciones: entradaHistorial.observaciones,
      historial: arrayUnion(entradaHistorial),
      updatedAt: serverTimestamp(),
    });

    const nuevoPesoObjetivo = Math.ceil(marca.peso * 1.1 * 2) / 2;
    const nuevaBarreraId = `auto_${barrera.id}`;
    batch.set(doc(db, COLLECTION, nuevaBarreraId), {
      clienteId: barrera.clienteId,
      preparadorId: barrera.preparadorId,
      pruebaId: barrera.pruebaId,
      nombre: barrera.nombre,
      categoria: barrera.categoria,
      subcategoria: barrera.subcategoria,
      unidad: barrera.unidad,
      ejercicioId: barrera.ejercicioId,
      ejercicioNombre: barrera.ejercicioNombre,
      pesoObjetivo: nuevoPesoObjetivo,
      repeticionesObjetivo: barrera.repeticionesObjetivo,
      objetivo: `${formatearPeso(nuevoPesoObjetivo)} kg × ${barrera.repeticionesObjetivo} repeticiones`,
      resultado: "",
      observaciones: "",
      estado: "pendiente",
      historial: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    cambios += 2;
  }

  batch.update(doc(db, "sesiones", sesionId), {
    barrerasFuerzaProcesadas: true,
    barrerasFuerzaProcesadasAt: serverTimestamp(),
  });
  if (cambios > 500) throw new Error("La sesión tiene demasiadas barreras de fuerza para procesar en un solo guardado.");
  await batch.commit();
}
