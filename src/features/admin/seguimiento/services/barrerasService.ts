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
