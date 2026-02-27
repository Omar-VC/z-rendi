import { useEffect, useState } from "react";
import { db } from "../firebase";
import { 
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import type { Cuota } from "../types";

export function useCuotas(clienteId: string) {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const q = query(collection(db, "cuotas"), where("clienteId", "==", clienteId));
        const snap = await getDocs(q);
        setCuotas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Cuota) })));
      } catch (err) {
        console.error("Error cargando cuotas:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchCuotas();
  }, [clienteId]);

  const addCuota = async (nuevaCuota: Omit<Cuota, "id">) => {
    const ref = await addDoc(collection(db, "cuotas"), { ...nuevaCuota, clienteId });
    setCuotas((prev) => [...prev, { id: ref.id, ...nuevaCuota }]);
  };

  const updateCuota = async (cuotaId: string, data: Partial<Cuota>) => {
    const ref = doc(db, "cuotas", cuotaId);
    await updateDoc(ref, data);
    setCuotas((prev) =>
      prev.map((c) => (c.id === cuotaId ? { ...c, ...data } : c))
    );
  };

  const deleteCuota = async (cuotaId: string) => {
    const ref = doc(db, "cuotas", cuotaId);
    await deleteDoc(ref);
    setCuotas((prev) => prev.filter((c) => c.id !== cuotaId));
  };

  return { cuotas, loading, addCuota, updateCuota, deleteCuota };

}
