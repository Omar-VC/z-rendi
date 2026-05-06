import { db } from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type { Ficha } from "../types";

export const getFichasByCliente = async (clienteId: string) => {
  const q = query(collection(db, "fichas"), where("clienteId", "==", clienteId));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    ...(d.data() as Ficha),
    id: d.id,
  }));
};

export const createFicha = async (
  ficha: Omit<Ficha, "id">
) => {
  const ref = await addDoc(collection(db, "fichas"), ficha);
  return { id: ref.id, ...ficha };
};

export const editFicha = async (
  fichaId: string,
  data: Partial<Ficha>
) => {
  const ref = doc(db, "fichas", fichaId);
  await updateDoc(ref, data);
};

export const removeFicha = async (fichaId: string) => {
  const ref = doc(db, "fichas", fichaId);
  await deleteDoc(ref);
};