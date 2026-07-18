import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { SesionEntrenamiento } from "../types/seguimiento";

const COLLECTION = "sesiones";

export async function obtenerSesionesCliente(
  clienteId: string,
): Promise<SesionEntrenamiento[]> {

  const q = query(
    collection(db, COLLECTION),
    where("clienteId", "==", clienteId),
    orderBy("fecha", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {

    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      fecha:
  data.fecha?.toDate
    ? data.fecha.toDate()
    : new Date(data.fecha),

createdAt:
  data.createdAt?.toDate
    ? data.createdAt.toDate()
    : undefined,

updatedAt:
  data.updatedAt?.toDate
    ? data.updatedAt.toDate()
    : undefined,
    } as SesionEntrenamiento;

  });

}

export async function crearSesion(
  sesion: Omit<SesionEntrenamiento, "id">,
) {

  await addDoc(collection(db, COLLECTION), {
    ...sesion,
    fecha: Timestamp.fromDate(sesion.fecha),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

}