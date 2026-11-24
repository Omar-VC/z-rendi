import { useCallback, useEffect, useState } from "react";

import type { SesionEntrenamiento } from "../types/seguimiento";
import { obtenerSesionesCliente } from "../services/seguimientoService";

export function useSeguimiento(clienteId?: string) {
  const [sesiones, setSesiones] = useState<SesionEntrenamiento[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarSesiones = useCallback(async () => {
    if (!clienteId) {
      setSesiones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await obtenerSesionesCliente(clienteId);
      setSesiones(data);
    } catch (error) {
      console.error("Error cargando sesiones:", error);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    cargarSesiones();
  }, [cargarSesiones]);

  return {
    sesiones,
    loading,
    recargar: cargarSesiones,
  };
}
