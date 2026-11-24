import { useCallback, useEffect, useState } from "react";

import type { Exercise } from "../types/exercise";

import {
  obtenerEjercicios,
  crearEjercicio,
} from "../services/exerciseService";

export function useExercises(preparadorId?: string) {
  const [ejercicios, setEjercicios] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarEjercicios = useCallback(async () => {
    if (!preparadorId) {
      setEjercicios([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await obtenerEjercicios(preparadorId);

      setEjercicios(data);
    } catch (error) {
      console.error("Error cargando ejercicios:", error);
    } finally {
      setLoading(false);
    }
  }, [preparadorId]);

  async function agregarEjercicio(
    ejercicio: Omit<Exercise, "id">
  ) {
    await crearEjercicio(ejercicio);

    await cargarEjercicios();
  }

  useEffect(() => {
    cargarEjercicios();
  }, [cargarEjercicios]);

  return {
    ejercicios,
    loading,
    recargar: cargarEjercicios,
    agregarEjercicio,
  };
}
