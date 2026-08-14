import { useEffect, useState } from "react";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../../firebase/firebase";

import type { SesionEntrenamiento } from "../../../admin/seguimiento/types/seguimiento";

export function useUltimaSesion(clienteId?: string) {
  const [sesion, setSesion] =
    useState<SesionEntrenamiento | undefined>(undefined);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!clienteId) {
      setSesion(undefined);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "sesiones"),
      where("clienteId", "==", clienteId),
      orderBy("fecha", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setSesion(undefined);
          setLoading(false);
          return;
        }

        const documento = snapshot.docs[0];
        const data = documento.data();

        setSesion({
          id: documento.id,
          clienteId: data.clienteId,
          preparadorId: data.preparadorId,
          fecha:
            data.fecha?.toDate?.() ??
            new Date(data.fecha),
          mes: data.mes,
          anio: data.anio,
          libroId: data.libroId,
          libroNombre: data.libroNombre,
          ejercicios: data.ejercicios ?? [],
          duracion: data.duracion,
          rpe: data.rpe,
          carga: data.carga,
          observaciones:
            data.observacionesCliente ??
            data.observaciones ??
            "",
        });

        setLoading(false);
      },
      (error) => {
        console.error(
          "Error cargando última sesión:",
          error,
        );

        setSesion(undefined);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [clienteId]);

  return {
    sesion,
    loading,
  };
}