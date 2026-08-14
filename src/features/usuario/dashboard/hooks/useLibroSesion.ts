import { useEffect, useState } from "react";

import type { TrainingBook } from "../../../admin/biblioteca/tipo-sesion/types/trainingBook";
import { obtenerLibros } from "../../../admin/biblioteca/tipo-sesion/services/trainingBooksService";


export function useLibroSesion(
  libroId?: string,
  preparadorId?: string
) {

  const [libro, setLibro] = useState<TrainingBook | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function cargarLibro() {

      if (!libroId || !preparadorId) {
        setLibro(null);
        setLoading(false);
        return;
      }


      try {

        setLoading(true);


        const libros = await obtenerLibros(preparadorId);


        const encontrado = libros.find(
          (item) => item.id === libroId
        );


        setLibro(encontrado ?? null);


      } catch (error) {

        console.error(
          "Error cargando libro:",
          error
        );

        setLibro(null);

      } finally {

        setLoading(false);

      }

    }


    cargarLibro();


  }, [libroId, preparadorId]);


  return {
    libro,
    loading,
  };

}