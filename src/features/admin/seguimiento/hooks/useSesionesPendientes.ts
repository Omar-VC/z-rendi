import { useEffect, useState } from "react";

import type { SesionPendiente } from "../types/sesionPendiente";

import {
  suscribirseSesionesPendientes,
} from "../services/sesionesPendientes.service";

export function useSesionesPendientes(
  clienteId: string,
  preparadorId: string,
) {
  const [sesiones, setSesiones] =
    useState<SesionPendiente[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe =
      suscribirseSesionesPendientes(
        clienteId,
        preparadorId,
        (nuevasSesiones) => {
          setSesiones(nuevasSesiones);
          setLoading(false);
          setError(null);
        },
      );

    return () => {
      unsubscribe();
    };
  }, [clienteId, preparadorId]);

  return {
    sesiones,
    loading,
    error,
  };
}