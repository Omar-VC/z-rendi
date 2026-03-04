import { useEffect, useState } from "react";
import { db } from "../firebase";
import { 
  collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import type { Sesion } from "../types";

export function useSesiones(clienteId: string) {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "sesiones"), where("clienteId", "==", clienteId));

    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSesiones(snapshot.docs.map((d) => ({ ...(d.data() as Sesion), id: d.id })));
      setLoading(false);
    });

    // Limpieza al desmontar
    return () => unsubscribe();
  }, [clienteId]);

  const addSesion = async (nuevaSesion: Omit<Sesion, "id" | "clienteId">) => {
    await addDoc(collection(db, "sesiones"), { ...nuevaSesion, clienteId });
    // No hace falta actualizar manualmente el estado: onSnapshot lo hará
  };

  const updateSesion = async (sesionId: string, data: Partial<Sesion>) => {
    const ref = doc(db, "sesiones", sesionId);
    await updateDoc(ref, data);
    // Tampoco hace falta actualizar manualmente el estado
  };

  const deleteSesion = async (sesionId: string) => {
    const ref = doc(db, "sesiones", sesionId);
    await deleteDoc(ref);
    // El snapshot se encarga de reflejar el cambio
  };

  return { sesiones, loading, addSesion, updateSesion, deleteSesion };
}
