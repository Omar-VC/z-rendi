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
import type { Cuota } from "../types";

export function subscribeCuotas(
  clienteId: string,
  callback: (cuotas: Cuota[]) => void
) {
  const q = query(collection(db, "cuotas"), where("clienteId", "==", clienteId));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      ...(d.data() as Cuota),
      id: d.id,
    }));
    callback(data);
  });
}

export async function addCuota(
  clienteId: string,
  nuevaCuota: Omit<Cuota, "id" | "clienteId">
) {
  await addDoc(collection(db, "cuotas"), { ...nuevaCuota, clienteId });
}

export async function updateCuota(
  cuotaId: string,
  data: Partial<Cuota>
) {
  const ref = doc(db, "cuotas", cuotaId);
  await updateDoc(ref, data);
}

export async function deleteCuota(cuotaId: string) {
  const ref = doc(db, "cuotas", cuotaId);
  await deleteDoc(ref);
}