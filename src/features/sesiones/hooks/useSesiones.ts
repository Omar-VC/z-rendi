import { useEffect, useState } from "react";

import type { Sesion } from "../types";

import {
  subscribeSesiones,
  createSesion,
  editSesion,
  removeSesion,
} from "../services/sesionesService";

export function useSesiones(clienteId: string) {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSesiones(clienteId, (data) => {
      setSesiones(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clienteId]);

  const addSesion = async (
    nuevaSesion: Omit<Sesion, "id" | "clienteId">
  ) => {
    await createSesion(nuevaSesion, clienteId);
  };

  const updateSesion = async (
    sesionId: string,
    data: Partial<Sesion>
  ) => {
    await editSesion(sesionId, data);
  };

  const deleteSesion = async (sesionId: string) => {
    await removeSesion(sesionId);
  };

  return {
    sesiones,
    loading,
    addSesion,
    updateSesion,
    deleteSesion,
  };
}