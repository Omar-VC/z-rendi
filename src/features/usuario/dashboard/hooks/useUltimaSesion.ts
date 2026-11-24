import { useEffect, useState } from "react";

import { suscribirseUltimaSesionCliente } from "../../../admin/seguimiento/services/seguimientoService";

import type { SesionEntrenamiento } from "../../../admin/seguimiento/types/seguimiento";

export function useUltimaSesion(clienteId?: string) {
  const [resultado, setResultado] = useState<{
    clienteId: string;
    sesion: SesionEntrenamiento | undefined;
  } | null>(null);

  useEffect(() => {
    if (!clienteId) return;

    let activo = true;

    const unsubscribe = suscribirseUltimaSesionCliente(
      clienteId,
      (resultado) => {
        if (activo) setResultado({ clienteId, sesion: resultado ?? undefined });
      },
    );

    return () => {
      activo = false;
      unsubscribe();
    };
  }, [clienteId]);

  const resultadoActual =
    clienteId && resultado?.clienteId === clienteId ? resultado : null;

  return {
    sesion: resultadoActual?.sesion,
    loading: Boolean(clienteId) && resultadoActual === null,
  };
}
