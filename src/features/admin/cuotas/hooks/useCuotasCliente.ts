import { useEffect, useState } from "react";

import type { Cuota } from "../types";
import { getCuotasCliente } from "../services/cuotas.service";


export function useCuotasCliente(clienteId?: string) {

  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const cargarCuotas = async () => {

    if (!clienteId) return;

    try {

      setLoading(true);
      setError(null);

      const data = await getCuotasCliente(clienteId);

      setCuotas(data);

    } catch (error) {

      console.error(error);

      setError(
        "No se pudieron cargar las cuotas."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    cargarCuotas();

  }, [clienteId]);


  return {
    cuotas,
    loading,
    error,
    recargar: cargarCuotas,
  };
}