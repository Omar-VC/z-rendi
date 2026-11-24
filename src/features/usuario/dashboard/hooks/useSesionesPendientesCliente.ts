import { useEffect, useState } from "react";
import type { SesionPendiente } from "../../../admin/seguimiento/types/sesionPendiente";
import {
  suscribirseSesionesPendientesCliente,
} from "../../../admin/seguimiento/services/sesionesPendientes.service";

export function useSesionesPendientesCliente(clienteId?: string) {
  const [resultado, setResultado] = useState<{
    clienteId: string;
    sesiones: SesionPendiente[];
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (!clienteId) return;

    let activo = true;

    const unsubscribe = suscribirseSesionesPendientesCliente(
      clienteId,
      (nuevasSesiones) => {
        if (activo) {
          setResultado({ clienteId, sesiones: nuevasSesiones, error: null });
        }
      },
      (error) => {
        console.error(error);
        if (activo) {
          setResultado({
            clienteId,
            sesiones: [],
            error: "No se pudieron cargar las sesiones pendientes.",
          });
        }
      }
    );

    return () => {
      activo = false;
      unsubscribe();
    };
  }, [clienteId]);

  const resultadoActual =
    clienteId && resultado?.clienteId === clienteId ? resultado : null;

  return {
    sesiones: resultadoActual?.sesiones ?? [],
    loading: Boolean(clienteId) && resultadoActual === null,
    error: resultadoActual?.error ?? null,
    refetch: () => {}, // No hace falta ejecutar nada porque el listener actualiza en tiempo real
  };
}
