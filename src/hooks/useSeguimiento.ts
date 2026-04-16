import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

interface Planilla {
  id: string;
  nombre: string;
  fechaCreacion?: any;
}

export const useSeguimiento = () => {
  const [planillas, setPlanillas] = useState<Planilla[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const colRef = collection(db, "planillas");

    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        setPlanillas(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          })) as Planilla[]
        );
      },
      (err) => {
        console.error("onSnapshot error planillas:", err);
      }
    );

    return () => unsub();
  }, []);

  const crearPlanilla = async (nombre: string) => {
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "planillas"), {
        nombre: nombre.trim(),
        fechaCreacion: new Date(),
      });
    } catch (err) {
      console.error("Error creando planilla:", err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPlanilla = async (planillaId: string) => {
    const confirmDelete = window.confirm(
      "¿Eliminar planilla y todos sus registros y atletas?"
    );
    if (!confirmDelete) return;

    try {
      const registrosSnap = await getDocs(
        collection(db, "planillas", planillaId, "registros")
      );

      const atletasSnap = await getDocs(
        collection(db, "planillas", planillaId, "atletas")
      );

      const deletePromises: Promise<void>[] = [];

      registrosSnap.forEach((r) => {
        deletePromises.push(
          deleteDoc(doc(db, "planillas", planillaId, "registros", r.id))
        );
      });

      atletasSnap.forEach((a) => {
        deletePromises.push(
          deleteDoc(doc(db, "planillas", planillaId, "atletas", a.id))
        );
      });

      await Promise.all(deletePromises);
      await deleteDoc(doc(db, "planillas", planillaId));
    } catch (err) {
      console.error("Error eliminando planilla:", err);
    }
  };

  return {
    planillas,
    crearPlanilla,
    eliminarPlanilla,
    loading,
  };
};