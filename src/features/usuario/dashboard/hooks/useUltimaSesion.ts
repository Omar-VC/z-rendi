import { useEffect, useState } from "react";

import { suscribirseUltimaSesionCliente } from "../../../admin/seguimiento/services/seguimientoService";

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

    const unsubscribe = suscribirseUltimaSesionCliente(
      clienteId,
      (resultado) => {
        setSesion(resultado ?? undefined);
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