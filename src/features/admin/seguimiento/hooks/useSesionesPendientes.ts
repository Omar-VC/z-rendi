import { useEffect, useState } from "react";

import type { SesionPendiente } from "../types/sesionPendiente";

import {
  suscribirseSesionesPendientes,
} from "../services/sesionesPendientes.service";

export function useSesionesPendientes(
  clienteId: string,
  preparadorId: string,
) {
  const clave = JSON.stringify([clienteId, preparadorId]);
  const [resultado, setResultado] = useState<{
    clave: string;
    sesiones: SesionPendiente[];
  } | null>(null);

  useEffect(() => {
    let activo = true;

    const unsubscribe =
      suscribirseSesionesPendientes(
        clienteId,
        preparadorId,
        (nuevasSesiones) => {
          if (activo) setResultado({ clave, sesiones: nuevasSesiones });
        },
      );

    return () => {
      activo = false;
      unsubscribe();
    };
  }, [clienteId, preparadorId, clave]);

  const resultadoActual = resultado?.clave === clave ? resultado : null;

  return {
    sesiones: resultadoActual?.sesiones ?? [],
    loading: resultadoActual === null,
    error: null,
  };
}
