import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export interface UsuarioActual {
  id: string;
  rol?: string;
  frecuenciaSemanal?: number;
}

export async function getUsuarioActual(
  uid: string,
): Promise<UsuarioActual | null> {
  const usuarioRef = doc(db, "usuarios", uid);

  const snapshot = await getDoc(usuarioRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as UsuarioActual;
}
