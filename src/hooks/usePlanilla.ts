import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { Atleta, Registro } from "../types/seguimiento";

type AtletaDB = Atleta & { id: string };
type RegistroDB = Registro & { id: string };

export const usePlanilla = (planillaId?: string) => {
  const [registros, setRegistros] = useState<RegistroDB[]>([]);
  const [atletas, setAtletas] = useState<AtletaDB[]>([]);

  useEffect(() => {
    if (!planillaId) return;

    const regCol = collection(db, "planillas", planillaId, "registros");
    const atlCol = collection(db, "planillas", planillaId, "atletas");

    const unsubReg = onSnapshot(
      query(regCol, orderBy("fecha", "desc")),
      (snap) => {
        setRegistros(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Registro),
          }))
        );
      }
    );

    const unsubAtl = onSnapshot(
      query(atlCol, orderBy("nombre")),
      (snap) => {
        setAtletas(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Atleta),
          }))
        );
      }
    );

    return () => {
      unsubReg();
      unsubAtl();
    };
  }, [planillaId]);

  // 👉 ATLETAS
  const guardarAtleta = async (data: Atleta, id?: string) => {
    if (!planillaId) return;

    try {
      if (id) {
        await updateDoc(doc(db, "planillas", planillaId, "atletas", id), data);
      } else {
        await addDoc(collection(db, "planillas", planillaId, "atletas"), data);
      }
    } catch (err) {
      console.error("Error guardando atleta:", err);
    }
  };

  const eliminarAtleta = async (atletaId: string) => {
    if (!planillaId) return;

    const confirm = window.confirm("¿Eliminar atleta y sus registros?");
    if (!confirm) return;

    try {
      const registrosSnap = await getDocs(
        query(
          collection(db, "planillas", planillaId, "registros"),
          where("atletaId", "==", atletaId)
        )
      );

      const deletePromises: Promise<void>[] = [];

      registrosSnap.forEach((r) => {
        deletePromises.push(
          deleteDoc(doc(db, "planillas", planillaId, "registros", r.id))
        );
      });

      await Promise.all(deletePromises);

      await deleteDoc(
        doc(db, "planillas", planillaId, "atletas", atletaId)
      );
    } catch (err) {
      console.error("Error eliminando atleta:", err);
    }
  };

  // 👉 REGISTROS
  const guardarRegistro = async (data: Registro, id?: string) => {
    if (!planillaId) return;

    try {
      // 🔥 cálculo centralizado de carga
      if (data.rpe && data.duracion) {
        data.carga = data.rpe * data.duracion;
      }

      if (id) {
        await updateDoc(
          doc(db, "planillas", planillaId, "registros", id),
          data
        );
      } else {
        await addDoc(
          collection(db, "planillas", planillaId, "registros"),
          data
        );
      }
    } catch (err) {
      console.error("Error guardando registro:", err);
    }
  };

  const eliminarRegistro = async (registroId: string) => {
    if (!planillaId) return;

    const confirm = window.confirm("¿Eliminar registro?");
    if (!confirm) return;

    try {
      await deleteDoc(
        doc(db, "planillas", planillaId, "registros", registroId)
      );
    } catch (err) {
      console.error("Error eliminando registro:", err);
    }
  };

  return {
    registros,
    atletas,
    guardarAtleta,
    eliminarAtleta,
    guardarRegistro,
    eliminarRegistro,
  };
};