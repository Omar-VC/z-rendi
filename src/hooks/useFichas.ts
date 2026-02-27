import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import type { Ficha } from "../types";

export function useFichas(clienteId: string) {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const q = query(collection(db, "fichas"), where("clienteId", "==", clienteId));
        const snap = await getDocs(q);
        setFichas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Ficha) })));
      } catch (err) {
        console.error("Error cargando fichas:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchFichas();
  }, [clienteId]);

  const addFicha = async (nuevaFicha: Omit<Ficha, "id">) => {
    const ref = await addDoc(collection(db, "fichas"), { ...nuevaFicha, clienteId });
    setFichas((prev) => [...prev, { id: ref.id, ...nuevaFicha }]);
  };

  const updateFicha = async (fichaId: string, data: Partial<Ficha>) => {
    const ref = doc(db, "fichas", fichaId);
    await updateDoc(ref, data);
    setFichas((prev) =>
      prev.map((f) => (f.id === fichaId ? { ...f, ...data } : f))
    );
  };

  const deleteFicha = async (fichaId: string) => { const ref = doc(db, "fichas", fichaId); await deleteDoc(ref); setFichas((prev) => prev.filter((f) => f.id !== fichaId)); };

  return { fichas, loading, addFicha, updateFicha, deleteFicha };
}
