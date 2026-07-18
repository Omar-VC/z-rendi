import { useEffect, useState } from "react";

import type { TrainingBook } from "../types/trainingBook";
import { obtenerLibros, crearLibro } from "../services/trainingBooksService";

export function useTrainingBooks(preparadorId?: string) {
  const [libros, setLibros] = useState<TrainingBook[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargarLibros() {
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
  }

  async function agregarLibro(
    libro: Omit<TrainingBook, "id">
  ) {
    await crearLibro(libro);
    await cargarLibros();
  }

  useEffect(() => {
    cargarLibros();
  }, [preparadorId]);

  return {
    libros,
    loading,
    recargar: cargarLibros,
    agregarLibro,
  };
}
