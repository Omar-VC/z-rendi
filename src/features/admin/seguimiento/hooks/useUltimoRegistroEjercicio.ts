import { useEffect, useState } from "react";

import { obtenerUltimoRegistroEjercicio } from "../services/registrosEjercicio.service";
import type { RegistroEjercicio } from "../types/registroEjercicio";

export function useUltimoRegistroEjercicio(
  clienteId: string | undefined,
  ejercicioId: string | undefined
) {
  const [registro, setRegistro] = useState<RegistroEjercicio | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clienteId || !ejercicioId) {
      setRegistro(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    obtenerUltimoRegistroEjercicio(clienteId, ejercicioId)
      .then((data) => {
        setRegistro(data);
        setLoading(false);
      })
      .catch(() => {
        setRegistro(null);
        setLoading(false);
      });
  }, [clienteId, ejercicioId]);

  return { registro, loading };
}