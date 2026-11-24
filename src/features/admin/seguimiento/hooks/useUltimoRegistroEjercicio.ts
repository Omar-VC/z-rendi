import { useEffect, useState } from "react";

import { obtenerUltimoRegistroEjercicio } from "../services/registrosEjercicio.service";
import type { RegistroEjercicio } from "../types/registroEjercicio";

export function useUltimoRegistroEjercicio(
  clienteId: string | undefined,
  ejercicioId: string | undefined
) {
  const clave = clienteId && ejercicioId
    ? JSON.stringify([clienteId, ejercicioId])
    : null;
  const [resultado, setResultado] = useState<{
    clave: string;
    registro: RegistroEjercicio | null;
  } | null>(null);

  useEffect(() => {
    if (!clienteId || !ejercicioId) {
      return;
    }

    let activo = true;
    obtenerUltimoRegistroEjercicio(clienteId, ejercicioId)
      .then((data) => {
        if (activo) {
          setResultado({
            clave: JSON.stringify([clienteId, ejercicioId]),
            registro: data,
          });
        }
      })
      .catch(() => {
        if (activo) {
          setResultado({
            clave: JSON.stringify([clienteId, ejercicioId]),
            registro: null,
          });
        }
      });

    return () => {
      activo = false;
    };
  }, [clienteId, ejercicioId]);

  const resultadoActual = clave && resultado?.clave === clave ? resultado : null;

  return {
    registro: resultadoActual?.registro ?? null,
    loading: clave !== null && resultadoActual === null,
  };
}
