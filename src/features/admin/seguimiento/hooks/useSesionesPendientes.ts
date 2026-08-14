import { useEffect, useState } from "react";

import type { SesionPendiente } from "../types/sesionPendiente";

import {
  suscribirseSesionesPendientes,
} from "../services/sesionesPendientes.service";

export function useSesionesPendientes(clienteId: string) {
  const [sesiones, setSesiones] = useState<SesionPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = suscribirseSesionesPendientes(
      clienteId,
      (nuevasSesiones) => {
        setSesiones(nuevasSesiones);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [clienteId]);

  return {
    sesiones,
    loading,
    error,
  };
}