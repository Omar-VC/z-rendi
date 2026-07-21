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

import type { PhysicalTest } from "../types/physicalTest";

const COLLECTION = "physicalTests";

export async function obtenerPruebas(
  preparadorId: string
): Promise<PhysicalTest[]> {

  const ref = collection(db, COLLECTION);

  const q = query(
    ref,
    where("preparadorId", "==", preparadorId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PhysicalTest[];
}

export async function crearPrueba(
  prueba: Omit<PhysicalTest, "id">
): Promise<void> {

  const ref = collection(db, COLLECTION);

  await addDoc(ref, {
    ...prueba,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

}

export async function actualizarPrueba(
  id: string,
  cambios: Partial<PhysicalTest>
): Promise<void> {

  const ref = doc(db, COLLECTION, id);

  await updateDoc(ref, {
    ...cambios,
    updatedAt: Timestamp.now(),
  });

}

export async function eliminarPrueba(
  id: string
): Promise<void> {

  const ref = doc(db, COLLECTION, id);

  await deleteDoc(ref);

}