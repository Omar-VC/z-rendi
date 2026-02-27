import { useEffect, useState } from "react";
import { db } from "../firebase";
import { 
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import type { Sesion } from "../types";

export function useSesiones(clienteId: string) {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const q = query(collection(db, "sesiones"), where("clienteId", "==", clienteId));
        const snap = await getDocs(q);
        setSesiones(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Sesion) })));
      } catch (err) {
        console.error("Error cargando sesiones:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchSesiones();
  }, [clienteId]);

  const addSesion = async (nuevaSesion: Omit<Sesion, "id">) => {
    const ref = await addDoc(collection(db, "sesiones"), { ...nuevaSesion, clienteId });
    setSesiones((prev) => [...prev, { id: ref.id, ...nuevaSesion }]);
  };

  const updateSesion = async (sesionId: string, data: Partial<Sesion>) => {
    const ref = doc(db, "sesiones", sesionId);
    await updateDoc(ref, data);
    setSesiones((prev) =>
      prev.map((s) => (s.id === sesionId ? { ...s, ...data } : s))
    );
  };

  const deleteSesion = async (sesionId: string) => {
    const ref = doc(db, "sesiones", sesionId);
    await deleteDoc(ref);
    setSesiones((prev) => prev.filter((s) => s.id !== sesionId));
  };

  return { sesiones, loading, addSesion, updateSesion, deleteSesion };
}
