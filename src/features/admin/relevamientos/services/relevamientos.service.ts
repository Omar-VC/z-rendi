import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../../../../firebase/firebase";
import type { Relevamiento } from "../types/relevamiento";

const RELEVAMIENTOS_COLLECTION = "relevamientos";

export async function getRelevamientos(): Promise<Relevamiento[]> {
  const auth = getAuth();
  const preparador = auth.currentUser;

  if (!preparador) {
    throw new Error("No hay usuario autenticado.");
  }

  const relevamientosQuery = query(
    collection(db, RELEVAMIENTOS_COLLECTION),
    where("preparadorId", "==", preparador.uid),
  );

  const snapshot = await getDocs(relevamientosQuery);

  return snapshot.docs.map(
    (documento) =>
      ({
        id: documento.id,
        ...documento.data(),
      }) as Relevamiento,
  );
}

export async function getRelevamientoById(
  id: string,
): Promise<Relevamiento | null> {
  const relevamientoRef = doc(
    db,
    RELEVAMIENTOS_COLLECTION,
    id,
  );

  const snapshot = await getDoc(relevamientoRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
  } as Relevamiento;
}

export async function crearRelevamiento(
  datos: Omit<Relevamiento, "id" | "preparadorId">,
): Promise<string> {
  const auth = getAuth();
  const preparador = auth.currentUser;

  if (!preparador) {
    throw new Error("No hay usuario autenticado.");
  }

  const docRef = await addDoc(
    collection(db, RELEVAMIENTOS_COLLECTION),
    {
      ...datos,
      preparadorId: preparador.uid,
    },
  );

  return docRef.id;
}

export async function actualizarRelevamiento(
  id: string,
  datos: Partial<Omit<Relevamiento, "id" | "preparadorId">>,
): Promise<void> {
  const relevamientoRef = doc(
    db,
    RELEVAMIENTOS_COLLECTION,
    id,
  );

  await updateDoc(relevamientoRef, datos);
}

export async function eliminarRelevamiento(
  id: string,
): Promise<void> {
  const relevamientoRef = doc(
    db,
    RELEVAMIENTOS_COLLECTION,
    id,
  );

  await deleteDoc(relevamientoRef);
}