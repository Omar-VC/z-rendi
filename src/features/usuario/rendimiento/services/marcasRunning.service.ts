import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../../../firebase/firebase";
import type { MarcaRunning } from "../types/marcaRunning";

export async function obtenerMarcasRunning(clienteId: string): Promise<MarcaRunning[]> {
  const snapshot = await getDoc(doc(db, "usuarios", clienteId));
  if (!snapshot.exists()) return [];

  const marcas = snapshot.data().marcasRunning;
  return Array.isArray(marcas) ? (marcas as MarcaRunning[]) : [];
}

export async function guardarMarcaRunning(
  clienteId: string,
  marca: MarcaRunning,
): Promise<void> {
  await updateDoc(doc(db, "usuarios", clienteId), {
    marcasRunning: arrayUnion(marca),
  });
}
