import { useEffect, useState } from "react";
import { db } from "../firebase";
import { 
  collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import type { Cuota } from "../types";

export function useCuotas(clienteId: string) {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cuotas"), where("clienteId", "==", clienteId));

    // Suscripción en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCuotas(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Cuota) })));
      setLoading(false);
    });

    // Limpieza al desmontar
    return () => unsubscribe();
  }, [clienteId]);

  const addCuota = async (nuevaCuota: Omit<Cuota, "id">) => {
    await addDoc(collection(db, "cuotas"), { ...nuevaCuota, clienteId });
    // No hace falta actualizar manualmente el estado: onSnapshot lo hará
  };

  const updateCuota = async (cuotaId: string, data: Partial<Cuota>) => {
    const ref = doc(db, "cuotas", cuotaId);
    await updateDoc(ref, data);
    // Tampoco hace falta actualizar manualmente el estado
  };

  const deleteCuota = async (cuotaId: string) => {
    const ref = doc(db, "cuotas", cuotaId);
    await deleteDoc(ref);
    // El snapshot se encarga de reflejar el cambio
  };

  return { cuotas, loading, addCuota, updateCuota, deleteCuota };
}
