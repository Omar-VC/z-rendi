import { useEffect, useState } from "react";

import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import {
  suscribirseSesionesPendientesCliente,
} from "../../../admin/seguimiento/services/sesionesPendientes.service";

export function useSesionesPendientesCliente(
  clienteId?: string,
) {
  const [sesiones, setSesiones] =
    useState<SesionPendiente[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) {
      setSesiones([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe =
      suscribirseSesionesPendientesCliente(
        clienteId,
        (nuevasSesiones) => {
          setSesiones(nuevasSesiones);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error(error);

          setSesiones([]);
          setLoading(false);
          setError(
            "No se pudieron cargar las sesiones pendientes.",
          );
        },
      );

    return unsubscribe;
  }, [clienteId]);

  return {
    sesiones,
    loading,
    error,
  };
}