import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../../../../firebase/firebase";

import type { Exercise } from "../types/exercise";

const COLLECTION = "exerciseLibrary";

export async function obtenerEjercicios(
  preparadorId: string
): Promise<Exercise[]> {
  const ref = collection(db, COLLECTION);

  const q = query(
    ref,
    where("preparadorId", "==", preparadorId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as Exercise[];
}

export async function crearEjercicio(
  ejercicio: Omit<Exercise, "id">
): Promise<void> {
  const ref = collection(db, COLLECTION);

  await addDoc(ref, {
    preparadorId: ejercicio.preparadorId,
    nombre: ejercicio.nombre,
    grupoMuscular: ejercicio.grupoMuscular,

    ...(ejercicio.descripcion
      ? { descripcion: ejercicio.descripcion }
      : {}),

    ...(ejercicio.videoUrl
      ? { videoUrl: ejercicio.videoUrl }
      : {}),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function actualizarEjercicio(
  id: string,
  cambios: Partial<Exercise>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);

  const datosLimpios = Object.fromEntries(
    Object.entries(cambios).filter(
      ([, valor]) => valor !== undefined
    )
  );

  await updateDoc(ref, {
    ...datosLimpios,
    updatedAt: Timestamp.now(),
  });
}

export async function eliminarEjercicio(
  id: string
): Promise<void> {
  const ref = doc(db, COLLECTION, id);

  await deleteDoc(ref);
}