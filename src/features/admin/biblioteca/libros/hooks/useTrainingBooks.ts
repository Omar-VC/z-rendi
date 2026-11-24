import { useCallback, useEffect, useState } from "react";

import type { TrainingBook } from "../types/trainingBook";
import { obtenerLibros, crearLibro } from "../services/trainingBooksService";

export function useTrainingBooks(preparadorId?: string) {
  const [libros, setLibros] = useState<TrainingBook[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarLibros = useCallback(async () => {
    if (!preparadorId) {
      setLibros([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await obtenerLibros(preparadorId);

      setLibros(data);
    } catch (error) {
      console.error("Error cargando libros:", error);
    } finally {
      setLoading(false);
    }
  }, [preparadorId]);

  async function agregarLibro(
    libro: Omit<TrainingBook, "id">
  ) {
    await crearLibro(libro);
    await cargarLibros();
  }

  useEffect(() => {
    cargarLibros();
  }, [cargarLibros]);

  return {
    libros,
    loading,
    recargar: cargarLibros,
    agregarLibro,
  };
}
