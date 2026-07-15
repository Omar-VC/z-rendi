import { useEffect, useState } from "react";

import type { FichaCliente } from "../types";
import { getFichaCliente } from "../services/ficha.service";


export function useFichaCliente(clienteId?: string) {

  const [ficha, setFicha] = useState<FichaCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const cargarFicha = async () => {

    if (!clienteId) return;

    try {

      setLoading(true);
      setError(null);


      const data = await getFichaCliente(clienteId);

      setFicha(data);


    } catch (error) {

      console.error(error);

      setError(
        "No se pudo cargar la ficha del cliente."
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    cargarFicha();

  }, [clienteId]);


  return {
    ficha,
    loading,
    error,
    recargar: cargarFicha,
  };
}