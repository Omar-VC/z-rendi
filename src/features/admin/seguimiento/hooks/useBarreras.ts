import { useCallback, useEffect, useState } from "react";

import type { Barrera } from "../types/barrera";
import { obtenerBarreras } from "../services/barrerasService";

export function useBarreras(clienteId: string) {
  const [barreras, setBarreras] = useState<Barrera[]>([]);

  const [loading, setLoading] = useState(true);

  const cargarBarreras = useCallback(async () => {

  try {

    setLoading(true);

    const data =
      await obtenerBarreras(clienteId);

    setBarreras(data);

  } catch(error){

    console.error(
      "Error cargando barreras:",
      error
    );

  } finally {

    setLoading(false);

  }

  }, [clienteId]);

  useEffect(() => {
    if (clienteId) {
      cargarBarreras();
    }
  }, [clienteId, cargarBarreras]);

  return {
    barreras,
    loading,
    recargar: cargarBarreras,
  };
}
