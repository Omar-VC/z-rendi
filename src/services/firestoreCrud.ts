import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Cuota, Ficha, Sesion } from "../types";

type FichaInput = Omit<Ficha, "id">;
type SesionInput = Omit<Sesion, "id">;
type CuotaInput = Omit<Cuota, "id">;

// ---------- FICHAS ----------
export const subscribeFichas = (onChange: (items: Ficha[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, "fichas"), (snapshot) => {
    const items: Ficha[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as FichaInput),
    }));
    onChange(items);
  });
};

export const createFicha = async (payload: FichaInput) => {
  await addDoc(collection(db, "fichas"), payload);
};

export const updateFicha = async (id: string, payload: Partial<FichaInput>) => {
  await updateDoc(doc(db, "fichas", id), payload);
};

export const deleteFicha = async (id: string) => {
  await deleteDoc(doc(db, "fichas", id));
};

// ---------- SESIONES ----------
export const subscribeSesiones = (onChange: (items: Sesion[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, "sesiones"), (snapshot) => {
    const items: Sesion[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as SesionInput),
    }));
    onChange(items);
  });
};

export const createSesion = async (payload: SesionInput) => {
  await addDoc(collection(db, "sesiones"), payload);
};

export const updateSesion = async (id: string, payload: Partial<SesionInput>) => {
  await updateDoc(doc(db, "sesiones", id), payload);
};

export const deleteSesion = async (id: string) => {
  await deleteDoc(doc(db, "sesiones", id));
};

// ---------- CUOTAS ----------
export const subscribeCuotas = (onChange: (items: Cuota[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, "cuotas"), (snapshot) => {
    const items: Cuota[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as CuotaInput),
    }));
    onChange(items);
  });
};

export const createCuota = async (payload: CuotaInput) => {
  await addDoc(collection(db, "cuotas"), payload);
};

export const updateCuota = async (id: string, payload: Partial<CuotaInput>) => {
  await updateDoc(doc(db, "cuotas", id), payload);
};

export const deleteCuota = async (id: string) => {
  await deleteDoc(doc(db, "cuotas", id));
};
