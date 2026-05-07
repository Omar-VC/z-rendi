import { db } from "../../../firebase/firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import type { Sesion } from "../types";

export const subscribeSesiones = (
  clienteId: string,
  callback: (sesiones: Sesion[]) => void
) => {
  const q = query(
    collection(db, "sesiones"),
    where("clienteId", "==", clienteId)
  );

  return onSnapshot(q, (snapshot) => {
    const sesiones = snapshot.docs.map((d) => ({
      ...(d.data() as Sesion),
      id: d.id,
    }));

    callback(sesiones);
  });
};

export const createSesion = async (
  sesion: Omit<Sesion, "id" | "clienteId">,
  clienteId: string
) => {
  await addDoc(collection(db, "sesiones"), {
    ...sesion,
    clienteId,
  });
};

export const editSesion = async (
  sesionId: string,
  data: Partial<Sesion>
) => {
  const ref = doc(db, "sesiones", sesionId);

  await updateDoc(ref, data);
};

export const removeSesion = async (
  sesionId: string
) => {
  const ref = doc(db, "sesiones", sesionId);

  await deleteDoc(ref);
};

export const completeSesion = async (
  sesionId: string
) => {
  const ref = doc(db, "sesiones", sesionId);

  await updateDoc(ref, {
    estado: "completada",
    completadaAt: new Date().toISOString(),
  });
};