import { useEffect, useState } from "react";

import type { Barrera } from "../types/barrera";
import { obtenerBarreras } from "../services/barrerasService";

export function useBarreras(clienteId: string) {
  const [barreras, setBarreras] = useState<Barrera[]>([]);

  const [loading, setLoading] = useState(true);

  async function cargarBarreras(){

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

}

  useEffect(() => {
    if (clienteId) {
      cargarBarreras();
    }
  }, [clienteId]);

  return {
    barreras,
    loading,
    recargar: cargarBarreras,
  };
}
