import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function getUsuarioActual(uid: string) {
  const usuarioRef = doc(db, "usuarios", uid);

  const snapshot = await getDoc(usuarioRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}