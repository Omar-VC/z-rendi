import { useCallback, useEffect, useState } from "react";

import type { Relevamiento } from "../types/relevamiento";

import {
  getRelevamientos,
  crearRelevamiento,
  actualizarRelevamiento,
  eliminarRelevamiento,
} from "../services/relevamientos.service";

export function useRelevamientos() {
  const [relevamientos, setRelevamientos] = useState<Relevamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarRelevamientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const datos = await getRelevamientos();

      setRelevamientos(datos);
    } catch (error) {
      console.error("Error al cargar relevamientos:", error);
      setError("No se pudieron cargar los relevamientos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarRelevamientos();
  }, [cargarRelevamientos]);

  const crear = async (
    datos: Omit<Relevamiento, "id" | "preparadorId">,
  ) => {
    const id = await crearRelevamiento(datos);
    await cargarRelevamientos();
    return id;
  };

  const actualizar = async (
    id: string,
    datos: Partial<Omit<Relevamiento, "id" | "preparadorId">>,
  ) => {
    await actualizarRelevamiento(id, datos);
    await cargarRelevamientos();
  };

  const eliminar = async (id: string) => {
    await eliminarRelevamiento(id);
    await cargarRelevamientos();
  };

  return {
    relevamientos,
    loading,
    error,
    cargarRelevamientos,
    crear,
    actualizar,
    eliminar,
  };
}