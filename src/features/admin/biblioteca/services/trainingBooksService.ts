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

import { db } from "../../../../firebase/firebase";

import type { TrainingBook } from "../types/trainingBook";

const COLLECTION = "trainingBooks";


export async function obtenerLibros(
  preparadorId: string
): Promise<TrainingBook[]> {
  const ref = collection(db, COLLECTION);

  const q = query(
    ref,
    where("preparadorId", "==", preparadorId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TrainingBook[];
}

export async function crearLibro(
  libro: Omit<TrainingBook, "id">
): Promise<void> {

  const ref = collection(db, COLLECTION);

  await addDoc(ref, {
    ...libro,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function eliminarLibro(
  id: string
): Promise<void> {

  await deleteDoc(
    doc(db, COLLECTION, id)
  );

}

export async function actualizarLibro(
  id: string,
  cambios: Partial<TrainingBook>
): Promise<void> {

  await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...cambios,
      updatedAt: Timestamp.now(),
    }
  );

}