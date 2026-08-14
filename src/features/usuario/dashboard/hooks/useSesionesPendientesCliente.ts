import { useEffect, useState } from "react";

import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";

import { suscribirseSesionesPendientes } from "../../../admin/seguimiento/services/sesionesPendientes.service";

export function useSesionesPendientesCliente(
  clienteId?: string,
) {
  const [sesiones, setSesiones] =
    useState<SesionPendiente[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!clienteId) {
      setSesiones([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe =
      suscribirseSesionesPendientes(
        clienteId,
        (nuevasSesiones) => {
          setSesiones(nuevasSesiones);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [clienteId]);

  return {
    sesiones,
    loading,
  };
}